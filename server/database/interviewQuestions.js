// interviewQuestions.js

export const interviewQuestions = {
    // ================= FRONTEND =================
    "Frontend Developer": {
      rounds: [
        {
          id: 1,
          name: "Introduction Round",
          time: 60,
          questions: [
            "Introduce yourself",
            "Why do you want to become a frontend developer?",
            "Which frontend technologies do you know?",
          ],
        },
        {
          id: 2,
          name: "Aptitude Round",
          time: 90,
          questions: [
            {
              q: "Which HTML tag is used for navigation?",
              options: ["<nav>", "<header>", "<section>", "<footer>"],
              answer: "<nav>",
            },
            {
              q: "CSS stands for?",
              options: [
                "Cascading Style Sheets",
                "Creative Style Sheets",
                "Computer Style Sheets",
                "Color Style Sheets",
              ],
              answer: "Cascading Style Sheets",
            },
          ],
        },
        {
          id: 3,
          name: "Technical Round",
          time: 120,
          questions: [
            {
              q: "What is React?",
              options: ["Library", "Framework", "Language", "Database"],
              answer: "Library",
            },
            {
              q: "What is useState?",
              options: ["Hook", "Component", "API", "Middleware"],
              answer: "Hook",
            },
          ],
        },
      ],
    },
  
    // ================= BACKEND =================
    "Backend Developer": {
      rounds: [
        {
          id: 1,
          name: "Introduction Round",
          time: 60,
          questions: [
            "Tell us about yourself",
            "Why backend development?",
            "Which backend languages do you know?",
          ],
        },
        {
          id: 2,
          name: "Aptitude Round",
          time: 90,
          questions: [
            {
              q: "REST is related to?",
              options: ["API", "Database", "UI", "Server"],
              answer: "API",
            },
          ],
        },
        {
          id: 3,
          name: "Technical Round",
          time: 120,
          questions: [
            {
              q: "What is Express.js?",
              options: ["Framework", "Library", "Database", "ORM"],
              answer: "Framework",
            },
            {
              q: "What is JWT used for?",
              options: [
                "Authentication",
                "Styling",
                "Database",
                "Hosting",
              ],
              answer: "Authentication",
            },
          ],
        },
      ],
    },
  
    // ================= FULL STACK =================
    "Full Stack Developer": {
      rounds: [
        {
          id: 1,
          name: "Introduction Round",
          time: 60,
          questions: [
            "What is full-stack development?",
            "Which stack are you comfortable with?",
          ],
        },
        {
          id: 2,
          name: "Aptitude Round",
          time: 90,
          questions: [
            {
              q: "Which is NOT a JavaScript framework?",
              options: ["React", "Angular", "Vue", "Django"],
              answer: "Django",
            },
          ],
        },
        {
          id: 3,
          name: "Technical Round",
          time: 120,
          questions: [
            {
              q: "What is MERN stack?",
              options: [
                "Mongo Express React Node",
                "MySQL Express React Node",
                "Mongo Ember React Node",
                "None",
              ],
              answer: "Mongo Express React Node",
            },
          ],
        },
      ],
    },
  
    // ================= DATA ANALYST =================
    "Data Analyst": {
      rounds: [
        {
          id: 1,
          name: "Introduction Round",
          time: 60,
          questions: [
            "Why data analytics?",
            "Which tools do you use for analysis?",
          ],
        },
        {
          id: 2,
          name: "Aptitude Round",
          time: 90,
          questions: [
            {
              q: "Which is a data visualization tool?",
              options: ["Tableau", "Docker", "Git", "Node.js"],
              answer: "Tableau",
            },
          ],
        },
        {
          id: 3,
          name: "Technical Round",
          time: 120,
          questions: [
            {
              q: "What is SQL used for?",
              options: [
                "Query data",
                "Design UI",
                "Build API",
                "Styling",
              ],
              answer: "Query data",
            },
          ],
        },
      ],
    },
  };
  