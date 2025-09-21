// ==========================================================================
// CLOUDFLARE WORKERS CHAT API FOR PATRICE MIRINDI WEBSITE
// ==========================================================================

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    try {
      const { message, session_id } = await request.json();

      if (!message || message.trim().length === 0) {
        return new Response(JSON.stringify({ 
          error: 'Message is required' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Load data sources
      const aboutData = await this.loadAboutData();
      const workData = await this.loadWorkData();
      const skillsData = await this.loadSkillsData();
      const projectsData = await this.loadProjectsData();

      // Classify intent and route to appropriate source
      const intent = this.classifyIntent(message);
      let response;

      switch (intent) {
        case 'ABOUT':
          response = await this.handleAboutQuery(message, aboutData, env);
          break;
        case 'WORK':
          response = await this.handleWorkQuery(message, workData, env);
          break;
        case 'SKILLS':
          response = await this.handleSkillsQuery(message, skillsData, env);
          break;
        case 'PROJECTS':
          response = await this.handleProjectsQuery(message, projectsData, env);
          break;
        default:
          response = {
            answer: "I can only answer questions about Patrice's background, work experience, skills, and projects. Please try rephrasing or use the Contact page for other inquiries.",
            sources: [],
            intent: 'OTHER'
          };
      }

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Chat API Error:', error);

      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: 'Sorry, I encountered an error processing your request. Please try again or contact me directly.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  // Intent classification
  classifyIntent(message) {
    const lowerMessage = message.toLowerCase();

    const aboutKeywords = [
      'about', 'bio', 'tell me', 'personal', 'yourself', 'who are you', 
      'your story', 'background', 'from', 'languages', 'location', 
      'education', 'journey', 'origin', 'where from'
    ];

    const workKeywords = [
      'work', 'experience', 'job', 'career', 'position', 'role',
      'employer', 'company', 'responsibilities', 'achievements', 'employment'
    ];

    const skillsKeywords = [
      'skills', 'expertise', 'tools', 'technologies', 'programming',
      'certifications', 'capabilities', 'proficient', 'good at', 'can you'
    ];

    const projectsKeywords = [
      'projects', 'work samples', 'portfolio', 'case studies',
      'what have you built', 'examples', 'deliverables', 'completed'
    ];

    let aboutScore = this.calculateKeywordScore(lowerMessage, aboutKeywords);
    let workScore = this.calculateKeywordScore(lowerMessage, workKeywords);
    let skillsScore = this.calculateKeywordScore(lowerMessage, skillsKeywords);
    let projectsScore = this.calculateKeywordScore(lowerMessage, projectsKeywords);

    const maxScore = Math.max(aboutScore, workScore, skillsScore, projectsScore);

    if (maxScore === 0) return 'OTHER';
    if (maxScore === aboutScore) return 'ABOUT';
    if (maxScore === workScore) return 'WORK';
    if (maxScore === skillsScore) return 'SKILLS';
    if (maxScore === projectsScore) return 'PROJECTS';

    return 'OTHER';
  },

  calculateKeywordScore(message, keywords) {
    return keywords.reduce((score, keyword) => {
      return message.includes(keyword) ? score + 1 : score;
    }, 0);
  },

  // Data loading functions (these would fetch from your data endpoints)
  async loadAboutData() {
    // In a real implementation, you'd fetch from your data source
    // For demo purposes, returning sample data structure
    return {
      name: "Patrice (Prina) Mirindi",
      title: "Senior Data Analyst & Economic Development Consultant",
      summary: "Senior Data Analyst & Economic Development Consultant with expertise in financial resilience, agricultural economics, and policy analysis.",
      location: "Winnipeg, MB, Canada",
      languages: ["English", "French", "Swahili", "Lingala"],
      personal_info: {
        origin: "Democratic Republic of Congo",
        current_location: "Winnipeg, MB, Canada",
        education: "MSc Agricultural Economics, University of Nairobi"
      }
    };
  },

  async loadWorkData() {
    return [
      {
        title: "Senior Data Analyst and Consultant",
        company: "Financial Resilience Institute",
        period: "October 2024 - Present",
        description: "Leading complex data analyses and strategic consulting to advance financial resilience across Canada and globally."
      }
      // Additional work experience would be loaded here
    ];
  },

  async loadSkillsData() {
    return {
      technical_skills: {
        data_analytics: {
          category: "Data Analytics & Statistical Analysis",
          skills: [
            { name: "R Programming", level: "Expert", years: 8 },
            { name: "Python", level: "Advanced", years: 6 },
            { name: "Stata", level: "Expert", years: 7 }
          ]
        }
      }
    };
  },

  async loadProjectsData() {
    return [
      {
        title: "Financial Resilience Assessment Framework",
        client: "Financial Resilience Institute",
        category: "Financial Health Research",
        description: "Developing comprehensive framework to measure and improve financial well-being across Canadian communities."
      }
      // Additional projects would be loaded here
    ];
  },

  // Query handlers
  async handleAboutQuery(message, aboutData, env) {
    const matches = this.searchAbout(message, aboutData);

    if (matches.length === 0) {
      return {
        answer: "I don't have enough information about that specific aspect of Patrice's background. You can find more details on the About page.",
        sources: [],
        intent: 'ABOUT'
      };
    }

    // If we have OpenAI API key, use it to generate a more natural response
    if (env.OPENAI_API_KEY) {
      try {
        const enhancedResponse = await this.enhanceResponseWithAI(
          message, matches[0].value, 'about', env.OPENAI_API_KEY
        );
        return {
          answer: enhancedResponse,
          sources: [`About: ${matches[0].key}`],
          intent: 'ABOUT'
        };
      } catch (error) {
        console.warn('OpenAI enhancement failed, using fallback');
      }
    }

    // Fallback response
    return {
      answer: matches[0].value,
      sources: [`About: ${matches[0].key}`],
      intent: 'ABOUT'
    };
  },

  async handleWorkQuery(message, workData, env) {
    const matches = this.searchWork(message, workData);

    if (matches.length === 0) {
      return {
        answer: "I don't have specific information about that aspect of Patrice's work experience. Check the Work Experience page for detailed information.",
        sources: [],
        intent: 'WORK'
      };
    }

    const bestMatch = matches[0];
    const answer = `${bestMatch.title} at ${bestMatch.company} (${bestMatch.period}): ${bestMatch.description}`;

    return {
      answer: answer,
      sources: [`Work: ${bestMatch.title}`],
      intent: 'WORK'
    };
  },

  async handleSkillsQuery(message, skillsData, env) {
    const matches = this.searchSkills(message, skillsData);

    if (matches.length === 0) {
      return {
        answer: "I don't have specific information about that skill or expertise area. Visit the Skills & Expertise page for a comprehensive overview.",
        sources: [],
        intent: 'SKILLS'
      };
    }

    const bestMatch = matches[0];
    return {
      answer: bestMatch.answer,
      sources: [`Skills: ${bestMatch.skill || bestMatch.category}`],
      intent: 'SKILLS'
    };
  },

  async handleProjectsQuery(message, projectsData, env) {
    const matches = this.searchProjects(message, projectsData);

    if (matches.length === 0) {
      return {
        answer: "I don't have information about projects matching that query. Check the Key Projects page for Patrice's portfolio.",
        sources: [],
        intent: 'PROJECTS'
      };
    }

    const bestMatch = matches[0];
    return {
      answer: `${bestMatch.title} for ${bestMatch.client}: ${bestMatch.description}`,
      sources: [`Project: ${bestMatch.title}`],
      intent: 'PROJECTS'
    };
  },

  // Search functions
  searchAbout(message, aboutData) {
    const lowerMessage = message.toLowerCase();
    const matches = [];

    const searchableFields = {
      'name': aboutData.name,
      'title': aboutData.title,
      'summary': aboutData.summary,
      'location': aboutData.location,
      'languages': aboutData.languages.join(', ')
    };

    Object.entries(searchableFields).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const score = this.calculateTextSimilarity(lowerMessage, value.toLowerCase());
        if (score > 0) {
          matches.push({ key, value, score });
        }
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  },

  searchWork(message, workData) {
    const lowerMessage = message.toLowerCase();
    const matches = [];

    workData.forEach(job => {
      const searchText = `${job.title} ${job.company} ${job.description}`.toLowerCase();
      const score = this.calculateTextSimilarity(lowerMessage, searchText);

      if (score > 0) {
        matches.push({ ...job, score });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  },

  searchSkills(message, skillsData) {
    const lowerMessage = message.toLowerCase();
    const matches = [];

    // Search technical skills
    Object.entries(skillsData.technical_skills || {}).forEach(([category, data]) => {
      const skills = data.skills || [];
      skills.forEach(skill => {
        if (lowerMessage.includes(skill.name.toLowerCase())) {
          matches.push({
            category: data.category,
            skill: skill.name,
            answer: `Patrice has ${skill.level.toLowerCase()} level expertise in ${skill.name} with ${skill.years} years of experience.`,
            score: 2
          });
        }
      });
    });

    return matches.sort((a, b) => b.score - a.score);
  },

  searchProjects(message, projectsData) {
    const lowerMessage = message.toLowerCase();
    const matches = [];

    projectsData.forEach(project => {
      const searchText = `${project.title} ${project.client} ${project.description}`.toLowerCase();
      const score = this.calculateTextSimilarity(lowerMessage, searchText);

      if (score > 0) {
        matches.push({ ...project, score });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  },

  calculateTextSimilarity(query, text) {
    const queryWords = query.split(/\s+/).filter(word => word.length > 2);
    const textWords = text.split(/\s+/);

    let score = 0;
    queryWords.forEach(queryWord => {
      if (textWords.some(textWord => textWord.includes(queryWord))) {
        score += 1;
      }
    });

    return score;
  },

  // Enhanced AI response generation (optional)
  async enhanceResponseWithAI(query, content, intent, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant answering questions about Patrice Mirindi's professional background. Use ONLY the provided information to answer questions. Do not add information not present in the source material. Keep responses conversational but professional, under 150 words.`
          },
          {
            role: 'user',
            content: `Question: "${query}"\n\nSource information: "${content}"\n\nPlease provide a helpful response using only the source information.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }
};