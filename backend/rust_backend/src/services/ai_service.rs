use actix_web::{Error, HttpResponse};
use serde::{Deserialize, Serialize};
use std::env;

// OpenAI API 请求结构
#[derive(Debug, Serialize)]
struct ChatCompletionRequest {
    model: String,
    messages: Vec<ChatMessage>,
    temperature: f32,
    max_tokens: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct ChatMessage {
    role: String,
    content: String,
}

// OpenAI API 响应结构
#[derive(Debug, Deserialize)]
struct ChatCompletionResponse {
    choices: Vec<Choice>,
}

#[derive(Debug, Deserialize)]
struct Choice {
    message: ChatMessage,
}

// 润色请求
#[derive(Debug, Deserialize)]
pub struct PolishRequest {
    pub text: String,
    pub section_type: String, // "skills", "work_experience", "project", etc.
}

// 润色响应
#[derive(Debug, Serialize)]
pub struct PolishResponse {
    pub original: String,
    pub polished: String,
    pub improvements: Vec<String>,
}

/// AI 润色服务
pub struct AIService {
    api_base: String,
    api_key: String,
    model: String,
    client: reqwest::Client,
}

impl AIService {
    pub fn new() -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let api_base = env::var("AI_API_BASE")
            .map_err(|_| "AI_API_BASE not configured in .env file")?;
        let api_key = env::var("AI_API_KEY")
            .map_err(|_| "AI_API_KEY not configured in .env file")?;
        let model = env::var("AI_MODEL")
            .map_err(|_| "AI_MODEL not configured in .env file")?;

        log::info!("🤖 AI Service initialized with model: {}", model);

        Ok(Self {
            api_base,
            api_key,
            model,
            client: reqwest::Client::new(),
        })
    }

    /// 生成润色提示词
    fn get_polish_prompt(&self, text: &str, section_type: &str) -> String {
        match section_type {
            "skills" => format!(
                "As a professional resume consultant, please help polish the following skills description. Requirements:\n\
                1. Use professional terminology and industry-standard expressions\n\
                2. Highlight the depth and breadth of skills\n\
                3. Quantify skill levels (if possible)\n\
                4. Keep it concise and professional\n\
                5. Return only the polished text without additional explanations\n\n\
                Original:\n{}", 
                text
            ),
            "work_experience" => format!(
                "As a professional resume consultant, please help polish the following work experience description. Requirements:\n\
                1. Use the STAR method (Situation-Task-Action-Result)\n\
                2. Highlight specific achievements and data\n\
                3. Start with action verbs to show initiative\n\
                4. Demonstrate personal contribution and value\n\
                5. Return only the polished text without additional explanations\n\n\
                Original:\n{}", 
                text
            ),
            "project" => format!(
                "As a professional resume consultant, please help polish the following project experience description. Requirements:\n\
                1. Clearly explain project background, scale, and complexity\n\
                2. Highlight technology stack and architecture\n\
                3. Emphasize personal role and key contributions\n\
                4. Quantify project outcomes and impact\n\
                5. Return only the polished text without additional explanations\n\n\
                Original:\n{}", 
                text
            ),
            "education" => format!(
                "As a professional resume consultant, please help polish the following education experience description. Requirements:\n\
                1. Highlight academic achievements and honors\n\
                2. Emphasize relevant coursework and research projects\n\
                3. Demonstrate learning ability and professional depth\n\
                4. Maintain professionalism and academic tone\n\
                5. Return only the polished text without additional explanations\n\n\
                Original:\n{}", 
                text
            ),
            _ => format!(
                "As a professional resume consultant, please help polish the following content. Requirements:\n\
                1. Use professional and concise language\n\
                2. Highlight key points and highlights\n\
                3. Enhance persuasiveness and attractiveness\n\
                4. Maintain authenticity\n\
                5. Return only the polished text without additional explanations\n\n\
                Original:\n{}", 
                text
            ),
        }
    }

    /// 调用 OpenAI API 进行润色
    pub async fn polish_text(&self, request: PolishRequest) -> Result<PolishResponse, Error> {
        let prompt = self.get_polish_prompt(&request.text, &request.section_type);

        let chat_request = ChatCompletionRequest {
            model: self.model.clone(),
            messages: vec![
                ChatMessage {
                    role: "system".to_string(),
                    content: "You are a senior resume consultant who specializes in helping job seekers optimize their resume content and improve resume quality and competitiveness.".to_string(),
                },
                ChatMessage {
                    role: "user".to_string(),
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        };

        log::info!("🤖 Calling AI API: {}/chat/completions", self.api_base);
        log::debug!("Request: {:?}", chat_request);

        let response = self.client
            .post(format!("{}/chat/completions", self.api_base))
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&chat_request)
            .send()
            .await
            .map_err(|e| {
                log::error!("❌ AI API request failed: {}", e);
                actix_web::error::ErrorInternalServerError(format!("AI API request failed: {}", e))
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            log::error!("❌ AI API error {}: {}", status, error_text);
            return Err(actix_web::error::ErrorInternalServerError(
                format!("AI API error: {} - {}", status, error_text)
            ));
        }

        let completion: ChatCompletionResponse = response.json().await.map_err(|e| {
            log::error!("❌ Failed to parse AI response: {}", e);
            actix_web::error::ErrorInternalServerError(format!("Failed to parse AI response: {}", e))
        })?;

        let polished_text = completion
            .choices
            .first()
            .map(|choice| choice.message.content.trim().to_string())
            .unwrap_or_else(|| request.text.clone());

        log::info!("✅ AI polishing completed successfully");

        // 生成改进建议
        let improvements = self.extract_improvements(&request.text, &polished_text);

        Ok(PolishResponse {
            original: request.text,
            polished: polished_text,
            improvements,
        })
    }

    /// 提取改进点（简单对比分析）
    fn extract_improvements(&self, original: &str, polished: &str) -> Vec<String> {
        let mut improvements = Vec::new();

        // 简单的改进点分析
        if polished.len() > original.len() {
            improvements.push("Added more details and quantified information".to_string());
        }
        
        if polished.contains("improve") || polished.contains("optim") || polished.contains("enhance") {
            improvements.push("Strengthened impact and achievement descriptions".to_string());
        }

        if polished.split_whitespace().count() > original.split_whitespace().count() {
            improvements.push("Enriched professional expressions and terminology".to_string());
        }

        if improvements.is_empty() {
            improvements.push("Optimized language expressions and professionalism".to_string());
        }

        improvements
    }
}

// 创建全局 AI Service 实例
lazy_static::lazy_static! {
    pub static ref AI_SERVICE: Result<AIService, Box<dyn std::error::Error + Send + Sync>> = AIService::new();
}

/// API Handler: 润色文本
pub async fn polish_text_handler(req: actix_web::web::Json<PolishRequest>) -> Result<HttpResponse, Error> {
    log::info!("📝 Polishing text for section: {}", req.section_type);

    let service = AI_SERVICE.as_ref().map_err(|e| {
        log::error!("❌ AI Service initialization failed: {}", e);
        actix_web::error::ErrorInternalServerError("AI Service not available")
    })?;

    let result = service.polish_text(req.into_inner()).await?;

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "success": true,
        "data": result
    })))
}
