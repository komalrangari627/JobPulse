const jobs = [
  {
    title: "Frontend Developer",
    company: "TechNova Solutions",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹6,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617557/logo.png",
    description: "Develop user interfaces using React, HTML, CSS, and JS.",
    extendedDescription: `As a Frontend Developer at TechNova Solutions, you will build high-quality, responsive web applications using modern frameworks like React.js. 
You will work closely with UI/UX designers, backend engineers, and product managers to ensure seamless user experiences.
The role involves optimizing performance, maintaining code quality, and contributing to team discussions on new frontend technologies.
This position provides opportunities for skill development, mentorship, and career growth in cutting-edge frontend technologies.`
  },
  {
    title: "Data Analyst",
    company: "FinEdge Analytics",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹5,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-2.png",
    description: "Analyze financial datasets and prepare reports using Python and SQL.",
    extendedDescription: `As a Data Analyst at FinEdge Analytics, you will collect, process, and analyze financial data to support business decision-making. 
You will work with large datasets, generate insights using statistical techniques, and present findings to stakeholders.
The role requires proficiency in SQL, Python, and data visualization tools like Tableau or Power BI.
You will also contribute to automating reporting processes and improving data pipelines.`
  },
  {
    title: "AI Researcher",
    company: "HealthBridge AI",
    location: "Pune",
    type: "Full-time",
    salary: "₹8,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-3.png",
    description: "Research and develop AI models for healthcare solutions.",
    extendedDescription: `As an AI Researcher at HealthBridge AI, you will design, develop, and validate machine learning and deep learning models to address healthcare challenges.
You will collaborate with data scientists, engineers, and domain experts to create solutions that improve patient outcomes and operational efficiency.
The role involves experimenting with cutting-edge AI frameworks, conducting research studies, and publishing results in peer-reviewed journals.
You will gain exposure to real-world healthcare data and have opportunities for professional growth in AI research.`
  },
  {
    title: "Cloud Engineer",
    company: "Cloudify Systems",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹7,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-4.png",
    description: "Manage and deploy cloud infrastructure using AWS/Azure.",
    extendedDescription: `As a Cloud Engineer at Cloudify Systems, you will design, deploy, and manage scalable cloud-based infrastructure solutions.
You will work with AWS, Azure, or GCP services to optimize cloud performance, implement security best practices, and automate deployment pipelines.
Collaboration with development and DevOps teams is key to ensure robust and secure cloud operations.
This role offers career growth in cloud architecture, certifications, and experience with modern cloud technologies.`
  },
  {
    title: "EdTech Developer",
    company: "EduSpark Learning",
    location: "Delhi",
    type: "Full-time",
    salary: "₹5,80,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-5.png",
    description: "Develop interactive educational software platforms.",
    extendedDescription: `As an EdTech Developer at EduSpark Learning, you will create interactive educational software and e-learning platforms for students and teachers.
You will develop scalable applications, implement gamification features, and integrate multimedia content to enhance learning experiences.
The role requires close coordination with instructional designers, product managers, and QA teams.
You will have opportunities to experiment with new technologies, contribute to product innovation, and grow in EdTech development.`
  },
  {
    title: "Cybersecurity Analyst",
    company: "CyberSafe Technologies",
    location: "Noida",
    type: "Full-time",
    salary: "₹6,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-6.png",
    description: "Monitor and secure enterprise networks.",
    extendedDescription: `As a Cybersecurity Analyst at CyberSafe Technologies, you will monitor, detect, and respond to security threats across enterprise networks.
You will manage firewalls, intrusion detection systems, and implement security protocols to safeguard sensitive information.
The role involves threat analysis, risk assessment, and collaborating with IT teams to ensure regulatory compliance.
You will gain hands-on experience in cybersecurity operations, incident response, and advanced security tools.`
  },
  {
    title: "IoT Engineer",
    company: "GreenAgro Labs",
    location: "Nagpur",
    type: "Full-time",
    salary: "₹6,20,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-7.png",
    description: "Design IoT solutions for smart agriculture.",
    extendedDescription: `As an IoT Engineer at GreenAgro Labs, you will design and deploy IoT devices and sensor networks for precision agriculture.
You will work with embedded systems, wireless communication, and cloud platforms to gather, analyze, and act on agricultural data.
Collaboration with agronomists, data scientists, and hardware engineers is essential to optimize smart farming solutions.
The role offers opportunities to innovate in agri-tech, work with cutting-edge IoT technologies, and improve sustainability in agriculture.`
  },
  {
    title: "Travel App Developer",
    company: "TravelSphere",
    location: "Chennai",
    type: "Full-time",
    salary: "₹5,90,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-8.png",
    description: "Build travel booking and itinerary apps.",
    extendedDescription: `As a Travel App Developer at TravelSphere, you will design and develop mobile and web applications for travel bookings and itinerary planning.
You will collaborate with UX designers, backend engineers, and product teams to create seamless travel experiences.
The role involves optimizing apps for performance, implementing real-time features, and integrating third-party APIs.
You will gain experience in mobile app development, cloud integration, and working in a dynamic travel-tech environment.`
  },
  {
    title: "Game Developer",
    company: "ByteForge Studios",
    location: "Kolkata",
    type: "Full-time",
    salary: "₹7,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-9.png",
    description: "Develop cross-platform video games using Unity.",
    extendedDescription: `As a Game Developer at ByteForge Studios, you will create engaging, cross-platform games using Unity or Unreal Engine.
You will collaborate with designers, animators, and sound engineers to deliver high-quality gaming experiences.
The role requires problem-solving skills, knowledge of physics engines, AI programming, and graphics optimization.
This position offers opportunities to showcase creativity, work on innovative projects, and grow as a professional game developer.`
  },
  {
    title: "E-Commerce Manager",
    company: "BlueOcean Retail",
    location: "Jaipur",
    type: "Full-time",
    salary: "₹6,80,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-10.png",
    description: "Manage online retail platforms and logistics.",
    extendedDescription: `As an E-Commerce Manager at BlueOcean Retail, you will oversee online retail operations, product listings, and order fulfillment.
You will work closely with marketing, logistics, and development teams to improve customer experience and optimize conversion rates.
The role involves analyzing sales data, implementing promotions, and driving operational efficiencies.
This position offers leadership opportunities and exposure to large-scale e-commerce platforms.`
  },
 {
    title: "Lab Technician",
    company: "MediCore Diagnostics",
    location: "Bhopal",
    type: "Full-time",
    salary: "₹4,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-11.png",
    description: "Handle diagnostic equipment and test reports.",
    extendedDescription: `As a Lab Technician at MediCore Diagnostics, you will operate and maintain diagnostic equipment to ensure accurate medical testing.
You will handle sample preparation, test execution, and reporting results to senior medical staff.
The role requires strict adherence to lab safety, quality control standards, and regulatory compliance.
This position offers hands-on experience in laboratory techniques and opportunities for professional growth in medical diagnostics.`
  },
  {
    title: "Robotics Engineer",
    company: "Zenith Robotics",
    location: "Pune",
    type: "Full-time",
    salary: "₹7,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-12.png",
    description: "Design industrial automation and robotics systems.",
    extendedDescription: `As a Robotics Engineer at Zenith Robotics, you will design, test, and implement robotics solutions for industrial automation.
You will collaborate with mechanical, electrical, and software engineers to build high-performance robots.
The role includes developing control systems, embedded programming, and optimizing mechanical designs.
This position provides opportunities to work on innovative robotics projects and advance your expertise in automation technologies.`
  },
  {
    title: "Aerospace Engineer",
    company: "InnovaSpace Tech",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹8,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-13.png",
    description: "Develop satellite and aerospace software systems.",
    extendedDescription: `As an Aerospace Engineer at InnovaSpace Tech, you will design, develop, and test satellite systems and aerospace software applications.
You will collaborate with multidisciplinary teams to integrate avionics, communication, and control systems.
The role involves simulations, system modeling, and performance optimization.
You will gain experience in aerospace technology, project management, and cutting-edge aerospace research.`
  },
{
    title: "Construction Project Manager",
    company: "BuildSmart Constructions",
    location: "Delhi",
    type: "Full-time",
    salary: "₹9,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-14.png",
    description: "Oversee smart construction projects and monitoring.",
    extendedDescription: `As a Construction Project Manager at BuildSmart Constructions, you will lead construction projects from planning to execution.
You will coordinate with architects, engineers, contractors, and stakeholders to ensure timely and quality delivery.
The role includes budgeting, resource management, risk assessment, and compliance with safety regulations.
This position provides opportunities for leadership growth, exposure to smart building technologies, and career advancement in construction management.`
  },
  {
    title: "Network Security Specialist",
    company: "SecureNet Pvt Ltd",
    location: "Noida",
    type: "Full-time",
    salary: "₹6,90,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-15.png",
    description: "Manage firewalls, intrusion detection, and network security.",
    extendedDescription: `As a Network Security Specialist at SecureNet Pvt Ltd, you will design, implement, and maintain security protocols for enterprise networks.
You will monitor network traffic, conduct vulnerability assessments, and respond to incidents.
The role involves collaboration with IT and DevOps teams to safeguard data and infrastructure.
You will gain exposure to advanced network security tools, certifications, and opportunities for growth in cybersecurity.`
  },
  {
    title: "Software Consultant",
    company: "AgileTech Softwares",
    location: "Pune",
    type: "Full-time",
    salary: "₹6,20,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-16.png",
    description: "Deliver web and enterprise software consulting services.",
    extendedDescription: `As a Software Consultant at AgileTech Softwares, you will work with clients to analyze requirements, design solutions, and deliver enterprise software applications.
You will collaborate with cross-functional teams and provide guidance on technology adoption and best practices.
The role involves troubleshooting, optimizing software processes, and client communication.
This position provides opportunities to enhance consulting skills, learn multiple tech stacks, and grow as a professional consultant.`
  },
  {
    title: "Computer Vision Engineer",
    company: "OptiVision Labs",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹7,80,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-17.png",
    description: "Develop computer vision and AI models.",
    extendedDescription: `As a Computer Vision Engineer at OptiVision Labs, you will develop and optimize computer vision algorithms for real-world applications.
You will work with image/video datasets, deep learning frameworks, and edge deployment.
Collaboration with AI researchers, software engineers, and product teams is key.
This role offers opportunities to work on cutting-edge vision technologies, research publications, and career growth in AI.`
  },
  {
    title: "Electric Vehicle Engineer",
    company: "NextGen Motors",
    location: "Chennai",
    type: "Full-time",
    salary: "₹8,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-18.png",
    description: "Develop EV systems and automation technologies.",
    extendedDescription: `As an Electric Vehicle Engineer at NextGen Motors, you will design and develop electric vehicle components, battery management systems, and automation technologies.
You will collaborate with mechanical, electrical, and software teams to optimize vehicle performance.
The role involves prototyping, testing, and compliance with automotive standards.
This position offers exposure to EV technologies, research projects, and career advancement in automotive engineering.`
  },
  {
    title: "Big Data Engineer",
    company: "DataWings",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹7,20,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-19.png",
    description: "Work with big data pipelines and analytics.",
    extendedDescription: `As a Big Data Engineer at DataWings, you will design and maintain scalable big data pipelines using Hadoop, Spark, or similar technologies.
You will collaborate with data scientists, analysts, and DevOps teams to process and analyze large datasets.
The role involves data modeling, ETL development, and performance optimization.
You will gain hands-on experience in big data technologies and career growth in data engineering.`
  },
  {
    title: "Real Estate Analyst",
    company: "UrbanNest Realty",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹5,80,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-20.png",
    description: "Analyze real estate trends and property data.",
    extendedDescription: `As a Real Estate Analyst at UrbanNest Realty, you will collect and analyze property data, market trends, and investment opportunities.
You will prepare reports, forecasts, and presentations for decision-making.
The role involves collaborating with brokers, marketing, and financial teams.
This position provides insights into real estate analytics, research skills, and career growth in property management and investment.`
  },
  {
    title: "React Developer",
    company: "CodeCrafters",
    location: "Pune",
    type: "Full-time",
    salary: "₹6,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-21.png",
    description: "Develop responsive web applications using React.",
    extendedDescription: `As a React Developer at CodeCrafters, you will develop high-performance web applications using React.js and associated libraries.
You will implement state management, reusable components, and unit testing.
The role requires collaboration with backend teams, designers, and QA engineers.
This position offers opportunities to master React, build scalable applications, and grow as a frontend engineer.`
  },
  {
    title: "Machine Learning Engineer",
    company: "MetaSoft AI",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹8,20,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-22.png",
    description: "Develop ML models and AI solutions.",
    extendedDescription: `As a Machine Learning Engineer at MetaSoft AI, you will develop, train, and deploy machine learning models for various applications.
You will collaborate with data scientists, engineers, and product teams.
The role involves feature engineering, model evaluation, and deployment on cloud platforms.
You will gain exposure to state-of-the-art ML frameworks, large datasets, and career growth in AI/ML engineering.`
  },
  {
    title: "FinTech Developer",
    company: "SmartBank Systems",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹7,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-23.png",
    description: "Develop digital banking platforms and APIs.",
    extendedDescription: `As a FinTech Developer at SmartBank Systems, you will design and develop secure financial applications, digital banking platforms, and APIs.
You will collaborate with product managers, security teams, and backend developers.
The role requires knowledge of payment gateways, security protocols, and banking regulations.
This position offers opportunities to innovate in fintech solutions and grow your career in financial software development.`
  },
  {
    title: "FoodTech Developer",
    company: "FoodieBay Tech",
    location: "Delhi",
    type: "Full-time",
    salary: "₹6,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-24.png",
    description: "Develop food delivery apps and management platforms.",
    extendedDescription: `As a FoodTech Developer at FoodieBay Tech, you will build and enhance applications for food delivery, restaurant management, and customer engagement.
You will collaborate with UX designers, backend engineers, and marketing teams.
The role involves API integration, database management, and app optimization.
This position offers exposure to food-tech innovations, mobile development, and growth opportunities in the tech-food sector.`
  },
  {
    title: "Renewable Energy Engineer",
    company: "EcoCharge Energy",
    location: "Pune",
    type: "Full-time",
    salary: "₹6,80,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-25.png",
    description: "Develop clean energy and IoT solutions.",
    extendedDescription: `As a Renewable Energy Engineer at EcoCharge Energy, you will design and implement renewable energy systems using solar, wind, and IoT-based monitoring.
You will collaborate with engineers, data scientists, and field teams.
The role involves performance analysis, optimization, and project implementation.
This position provides exposure to green energy technologies and career growth in sustainable energy solutions.`
  },
  {
    title: "HR Tech Specialist",
    company: "TalentBridge HR",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹5,90,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-26.png",
    description: "Develop recruitment and HR analytics software.",
    extendedDescription: `As an HR Tech Specialist at TalentBridge HR, you will design and develop HR management tools, recruitment platforms, and analytics dashboards.
You will collaborate with HR managers, UX designers, and backend teams.
The role involves data analysis, workflow automation, and performance optimization.
This position provides exposure to HR technology trends and career growth in HR software solutions.`
  },
  {
    title: "Quantum Computing Researcher",
    company: "QuantumBit Labs",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹9,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-27.png",
    description: "Work on quantum algorithms and simulations.",
    extendedDescription: `As a Quantum Computing Researcher at QuantumBit Labs, you will develop algorithms, simulations, and quantum models for next-generation computing.
You will collaborate with physicists, software engineers, and AI researchers.
The role involves testing quantum circuits, optimizing performance, and contributing to publications.
This position provides exposure to cutting-edge quantum technologies and career growth in research and development.`
  },
  {
    title: "Mobile App Developer",
    company: "UrbanRider Mobility",
    location: "Chennai",
    type: "Full-time",
    salary: "₹6,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-28.png",
    description: "Develop ride-sharing mobile applications.",
    extendedDescription: `As a Mobile App Developer at UrbanRider Mobility, you will design and develop mobile applications for ride-sharing and transportation services.
You will collaborate with backend teams, UI/UX designers, and QA engineers.
The role involves app optimization, integration of mapping APIs, and user experience enhancements.
This position offers opportunities to work in mobility tech, mobile development, and career growth.`
  },
  {
    title: "Aerospace Software Engineer",
    company: "AeroNext Systems",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹8,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-41.png",
    description: "Develop avionics software and flight analytics.",
    extendedDescription: `As an Aerospace Software Engineer at AeroNext Systems, you will develop software for avionics systems, flight simulation, and analytics.
You will work closely with aerospace engineers, QA teams, and product managers to ensure software reliability.
The role includes performance optimization, safety compliance, and system integration.
This position provides exposure to aerospace technology, flight control systems, and opportunities for career advancement.`
  },
  {
    title: "Biotech Researcher",
    company: "BioCore Research",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹7,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-42.png",
    description: "Conduct research in life sciences and genetics.",
    extendedDescription: `As a Biotech Researcher at BioCore Research, you will conduct experiments in genetics, molecular biology, and bioinformatics.
You will collaborate with lab technicians, scientists, and project leads to design and analyze experiments.
The role includes data collection, lab analysis, and reporting research findings.
This position offers opportunities to contribute to scientific publications, innovative biotech solutions, and career growth in research.`
  },
  {
    title: "Network Engineer",
    company: "WaveLink Networks",
    location: "Chennai",
    type: "Full-time",
    salary: "₹7,20,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-43.png",
    description: "Design and optimize networking solutions.",
    extendedDescription: `As a Network Engineer at WaveLink Networks, you will design, implement, and maintain enterprise network infrastructure.
You will collaborate with IT teams, security experts, and project managers to optimize performance.
The role involves troubleshooting, configuration, and ensuring network reliability and scalability.
This position provides exposure to advanced networking technologies and career growth in network engineering.`
  },
  {
    title: "Video Producer",
    company: "PixelEdge Media",
    location: "Delhi",
    type: "Full-time",
    salary: "₹5,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-44.png",
    description: "Produce and edit digital content.",
    extendedDescription: `As a Video Producer at PixelEdge Media, you will create, edit, and produce engaging digital content for clients and internal projects.
You will work with creative teams, directors, and marketing specialists to deliver high-quality media.
The role involves storytelling, video editing, post-production, and project management.
This position provides opportunities to enhance media production skills and career growth in digital content creation.`
  },
  {
    title: "Data Scientist",
    company: "DeepData Systems",
    location: "Pune",
    type: "Full-time",
    salary: "₹8,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-45.png",
    description: "Analyze datasets and build AI solutions.",
    extendedDescription: `As a Data Scientist at DeepData Systems, you will analyze complex datasets and develop AI models to generate actionable insights.
You will collaborate with engineers, analysts, and business teams to implement data-driven solutions.
The role includes statistical analysis, model training, and data visualization.
This position offers exposure to cutting-edge AI tools, machine learning workflows, and opportunities for career advancement.`
  },
  {
    title: "GovTech Developer",
    company: "CivicLabs",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹6,80,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-46.png",
    description: "Develop citizen service platforms for governance.",
    extendedDescription: `As a GovTech Developer at CivicLabs, you will design and implement digital solutions for public services and government applications.
You will collaborate with policy experts, UX designers, and backend engineers.
The role involves API integration, platform optimization, and maintaining secure, scalable services.
This position offers exposure to civic technology, public sector solutions, and career growth in government tech initiatives.`
  },
  {
    title: "Streaming App Developer",
    company: "Streamify",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹6,50,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-47.png",
    description: "Build OTT and media streaming platforms.",
    extendedDescription: `As a Streaming App Developer at Streamify, you will develop and optimize OTT platforms, media streaming applications, and interactive features.
You will work closely with backend engineers, UI/UX designers, and QA teams.
The role involves performance tuning, API integration, and cross-platform compatibility.
This position provides exposure to media streaming technologies and career growth in digital entertainment.`
  },
  {
    title: "IT Support Engineer",
    company: "TechAssist IT",
    location: "Pune",
    type: "Full-time",
    salary: "₹5,80,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-48.png",
    description: "Provide IT maintenance and support.",
    extendedDescription: `As an IT Support Engineer at TechAssist IT, you will provide technical support, troubleshoot software/hardware issues, and maintain IT systems.
You will collaborate with internal teams, vendors, and clients to ensure smooth operations.
The role involves system updates, problem resolution, and technical documentation.
This position provides exposure to IT infrastructure, hands-on problem-solving, and career growth in IT support.`
  },
  {
    title: "AI Research Engineer",
    company: "Visionary Labs",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹8,20,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765617642/logo-49.png",
    description: "Research next-gen AI and sensor technology.",
    extendedDescription: `As an AI Research Engineer at Visionary Labs, you will research and implement advanced AI algorithms and sensor technologies.
You will collaborate with data scientists, engineers, and product teams to prototype innovative solutions.
The role includes experimentation, model training, and publishing research findings.
This position offers exposure to cutting-edge AI research and career growth in AI/ML innovation.`
  },
  {
    title: "Edge Computing Specialist",
    company: "QuantumEdge",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹9,00,000/yr",
    logo: "https://res.cloudinary.com/dct17gxgo/image/upload/v1765616897/50_reh7pu.png",
    description: "Develop edge computing and AI platforms.",
    extendedDescription: `As an Edge Computing Specialist at QuantumEdge, you will design and develop edge computing systems and AI platforms for real-time applications.
You will collaborate with cloud engineers, software developers, and product teams.
The role involves deployment, optimization, and monitoring of edge devices and services.
This position provides exposure to next-gen computing technologies and career growth in distributed AI systems.`
  }
];

export { jobs };