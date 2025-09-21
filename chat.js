// ==========================================================================
// SERVERLESS CHAT FUNCTION (Cloudflare Workers)
// ==========================================================================

// This is a Cloudflare Workers function that handles the chat API
// It implements strict grounding with dual-source routing as specified

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { message, session_id } = await request.json();

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid message' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Load data sources
      const faqData = await this.loadFAQData();
      const aboutData = await this.loadAboutData();

      // Route intent and retrieve relevant information
      const result = await this.processMessage(message, faqData, aboutData, env);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Chat API Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        answer: 'I\'m experiencing technical difficulties. Please try again or contact me directly at patricemirindi@gmail.com',
        sources: []
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },

  async loadFAQData() {
    // In production, this would fetch from your GitHub Pages or CDN
    // For now, return a subset of the FAQ data
    return [
      {
        id: 1,
        question: "Where are you from?",
        keywords: ["origin", "country", "from", "nationality"],
        answer: "I am from the Democratic Republic of Congo.",
        category: "personal"
      },
      {
        id: 2,
        question: "What do you do for a living?",
        keywords: ["job", "profession", "work", "career"],
        answer: "I am a Senior Data Analyst and Consultant, specializing in economic policy, financial resilience, data analytics, and market research.",
        category: "work"
      },
      {
        id: 3,
        question: "How can I contact you?",
        keywords: ["contact", "email", "reach out", "get in touch"],
        answer: "You can reach me via email at patricemirindi@gmail.com.",
        category: "contact"
      },
      {
        id: 4,
        question: "What tools do you use for data analytics?",
        keywords: ["analytics", "visualization", "tools"],
        answer: "I use R, Python, Stata, SPSS, and Power BI for data analytics. These tools help in modeling economic trends, creating dashboards, and making data-driven policy recommendations.",
        category: "technical"
      },
      {
        id: 5,
        question: "What languages do you speak?",
        keywords: ["languages", "speak", "fluent", "multilingual"],
        answer: "I am fluent in English and French, with conversational abilities in Swahili and Lingala.",
        category: "personal"
      }
    ];
  },

  async loadAboutData() {
    return {
      name: "Patrice Mirindi",
      roles: ["Senior Data Analyst & Consultant", "Economic Development Expert"],
      summary: "Senior Data Analyst & Economic Development Consultant with expertise in financial resilience, agricultural economics, and policy analysis.",
      location: "Winnipeg, MB, Canada",
      languages: ["English", "French", "Swahili", "Lingala"],
      skills: ["R", "Python", "Stata", "SPSS", "Power BI", "Project Management (PMP)"],
      availability: "Open to consulting, speaking engagements, and teaching opportunities"
    };
  },

  async processMessage(message, faqData, aboutData, env) {
    const intent = this.classifyIntent(message);

    let retrievedData = [];
    let sources = [];

    switch (intent) {
      case 'FAQ':
        retrievedData = this.retrieveFromFAQ(message, faqData);
        sources = retrievedData.map(item => `FAQ #${item.id}`);
        break;

      case 'ABOUT':
        retrievedData = this.retrieveFromAbout(message, aboutData);
        sources = retrievedData.map(item => `About: ${item.key}`);
        break;

      default:
        return {
          answer: "I can only answer questions from the site FAQ or about Patrice. Please try rephrasing or use the Contact page.",
          sources: [],
          intent: 'OTHER'
        };
    }

    if (retrievedData.length === 0) {
      return {
        answer: "I don't have enough information in the site data to answer that question. Please try rephrasing or contact me directly.",
        sources: [],
        intent: intent
      };
    }

    // Use LLM to compose answer (if available) or return best match
    const answer = await this.composeAnswer(message, retrievedData, env) || 
                   retrievedData[0].answer || 
                   retrievedData[0].value;

    return {
      answer: answer,
      sources: sources.slice(0, 3), // Limit to top 3 sources
      intent: intent
    };
  },

  classifyIntent(message) {
    const lowerMessage = message.toLowerCase();

    // FAQ indicators
    const faqKeywords = [
      'what do you do', 'experience', 'projects', 'tools', 'skills',
      'education', 'background', 'work', 'consulting', 'analytics',
      'services', 'contact', 'from where', 'languages'
    ];

    // About indicators  
    const aboutKeywords = [
      'about you', 'bio', 'tell me', 'personal', 'yourself',
      'who are you', 'your story', 'career', 'journey', 'name',
      'location', 'availability', 'roles'
    ];

    const faqScore = faqKeywords.reduce((score, keyword) => {
      return lowerMessage.includes(keyword) ? score + 1 : score;
    }, 0);

    const aboutScore = aboutKeywords.reduce((score, keyword) => {
      return lowerMessage.includes(keyword) ? score + 1 : score;
    }, 0);

    if (aboutScore > faqScore) {
      return 'ABOUT';
    } else if (faqScore > 0) {
      return 'FAQ';
    } else {
      return 'OTHER';
    }
  },

  retrieveFromFAQ(message, faqData) {
    const lowerMessage = message.toLowerCase();
    const scored = faqData.map(item => {
      let score = 0;

      // Check keywords
      item.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          score += 2;
        }
      });

      // Check question similarity
      const questionWords = item.question.toLowerCase().split(/\s+/);
      questionWords.forEach(word => {
        if (word.length > 3 && lowerMessage.includes(word)) {
          score += 1;
        }
      });

      return { ...item, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  },

  retrieveFromAbout(message, aboutData) {
    const lowerMessage = message.toLowerCase();
    const matches = [];

    const searchableFields = {
      'name': aboutData.name,
      'summary': aboutData.summary,
      'location': aboutData.location,
      'languages': aboutData.languages.join(', '),
      'skills': aboutData.skills.join(', '),
      'availability': aboutData.availability,
      'roles': aboutData.roles.join(', ')
    };

    Object.entries(searchableFields).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const words = value.toLowerCase().split(/\s+/);
        const messageWords = lowerMessage.split(/\s+/);

        let score = 0;
        messageWords.forEach(msgWord => {
          if (msgWord.length > 3 && words.some(word => word.includes(msgWord))) {
            score += 1;
          }
        });

        if (score > 0) {
          matches.push({
            key: key,
            value: value,
            answer: value,
            score: score
          });
        }
      }
    });

    return matches.sort((a, b) => b.score - a.score).slice(0, 3);
  },

  async composeAnswer(message, retrievedData, env) {
    // If OpenAI API key is available, use GPT to compose a better answer
    if (env.OPENAI_API_KEY) {
      try {
        const context = retrievedData.map(item => 
          `${item.question || item.key}: ${item.answer || item.value}`
        ).join('\n\n');

        const prompt = `Based strictly on the following information about Patrice Mirindi, answer the user's question. Do not add any information not present in the context.

Context:
${context}

User Question: ${message}

Answer (be concise and helpful):`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant that answers questions about Patrice Mirindi based strictly on provided context. Never add information not in the context.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 200,
            temperature: 0.3,
          }),
        });

        const data = await response.json();
        if (data.choices && data.choices[0]) {
          return data.choices[0].message.content.trim();
        }
      } catch (error) {
        console.error('OpenAI API error:', error);
      }
    }

    // Fallback: return the best match
    return null;
  }
};