
// Enhanced Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.syllabus-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const searchToggle = document.getElementById('search-toggle');
    const navSearch = document.getElementById('nav-search');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Close search if open
        if (navSearch.classList.contains('active')) {
            navSearch.classList.remove('active');
            searchResults.classList.remove('active');
        }
    });
    
    // Search toggle
    searchToggle.addEventListener('click', () => {
        navSearch.classList.toggle('active');
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
        
        // Focus on input when search is opened
        if (navSearch.classList.contains('active')) {
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        } else {
            searchResults.classList.remove('active');
        }
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
        if (isDarkMode) {
            document.body.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (navSearch.classList.contains('active') && 
            !e.target.closest('#nav-search') && 
            !e.target.closest('#search-toggle')) {
            navSearch.classList.remove('active');
            searchResults.classList.remove('active');
        }
    });
    
    // Search functionality
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(searchInput.value.trim());
    });
    
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            searchResults.classList.remove('active');
        } else {
            performSearch(searchInput.value.trim());
        }
    });
    
    function performSearch(query) {
        if (query === '') {
            searchResults.classList.remove('active');
            return;
        }
        
        // Simple search implementation
        const content = document.body.textContent.toLowerCase();
        const searchTerms = query.toLowerCase().split(' ');
        
        // Find sections that contain the search terms
        const sections = document.querySelectorAll('.section, .card, .highlight-box');
        const results = [];
        
        sections.forEach(section => {
            const sectionText = section.textContent.toLowerCase();
            let matchCount = 0;
            
            searchTerms.forEach(term => {
                if (sectionText.includes(term)) {
                    matchCount++;
                }
            });
            
            if (matchCount > 0) {
                // Get the section title or heading
                const heading = section.querySelector('h2, h3') || 
                               section.closest('.section')?.querySelector('h2');
                const headingText = heading ? heading.textContent : 'Content';
                
                // Get a snippet of text around the first match
                const firstMatchIndex = sectionText.indexOf(searchTerms[0]);
                const start = Math.max(0, firstMatchIndex - 50);
                const end = Math.min(sectionText.length, firstMatchIndex + 100);
                let snippet = sectionText.substring(start, end);
                
                // Highlight the search terms in the snippet
                searchTerms.forEach(term => {
                    const regex = new RegExp(term, 'gi');
                    snippet = snippet.replace(regex, '<mark>$&</mark>');
                });
                
                results.push({
                    heading: headingText,
                    snippet: snippet,
                    element: section
                });
            }
        });
        
        // Display results
        displaySearchResults(results, query);
    }
    
    function displaySearchResults(results, query) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = `<div class="result-item"><p>No results found for "${query}"</p></div>`;
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <h4>${result.heading}</h4>
                    <p>${result.snippet}...</p>
                `;
                
                resultItem.addEventListener('click', () => {
                    result.element.scrollIntoView({ behavior: 'smooth' });
                    navSearch.classList.remove('active');
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.classList.add('active');
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize quote carousel
    initQuoteCarousel();
    
    // Initialize chatbot functionality
    initChatbot();
    
    // Initialize custom cursor
    const cursor = document.querySelector('.cursor');
    
    // Show custom cursor and hide default one
    cursor.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .section-title').forEach(el => {
        observer.observe(el);
    });
});

// Enhanced Quote Carousel Functionality
function initQuoteCarousel() {
    const quotes = document.querySelectorAll('.quote');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const carousel = document.querySelector('.quote-carousel');
    
    // Check if elements exist
    if (!quotes.length || !dots.length) {
        console.error('Carousel elements not found');
        return;
    }
    
    let currentQuote = 0;
    let autoPlayInterval;
    
    // Function to show a specific quote
    function showQuote(index) {
        // Hide all quotes
        quotes.forEach(quote => {
            quote.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected quote and update active dot
        quotes[index].style.display = 'block';
        dots[index].classList.add('active');
        
        // Update current quote index
        currentQuote = index;
        
        // Add subtle animation to carousel
        carousel.style.animation = 'none';
        setTimeout(() => {
            carousel.style.animation = 'pulse 1s ease';
        }, 10);
    }
    
    // Next quote function
    function nextQuote() {
        let nextIndex = (currentQuote + 1) % quotes.length;
        showQuote(nextIndex);
    }
    
    // Previous quote function
    function prevQuote() {
        let prevIndex = (currentQuote - 1 + quotes.length) % quotes.length;
        showQuote(prevIndex);
    }
    
    // Set up auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextQuote, 7000);
    }
    
    // Stop auto-play
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners for navigation
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextQuote();
            startAutoPlay();
        });
        
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevQuote();
            startAutoPlay();
        });
    }
    
    // Event listeners for dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoPlay();
                showQuote(index);
                startAutoPlay();
            });
        });
    }
    
    // Pause auto-play when hovering over carousel
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Show the first quote immediately
    showQuote(0);
    
    // Initialize auto-play
    startAutoPlay();
}

// Chatbot functionality
function initChatbot() {
    const chatbotWidget = document.querySelector('.chatbot-widget');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-text-input');
    const chatbotSend = document.querySelector('.chatbot-send');
    
    // Create typing indicator element
    function createTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chatbot-message', 'chatbot-response', 'typing-indicator');
        
        const dotContainer = document.createElement('div');
        dotContainer.classList.add('typing-dots');
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dotContainer.appendChild(dot);
        }
        
        typingDiv.appendChild(dotContainer);
        return typingDiv;
    }
    
    // Remove typing indicator
    function removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.remove();
        }
    }
    
    // Simulate typing effect
    function typeMessage(message, element, callback) {
        let i = 0;
        const typingSpeed = 10 + Math.random() * 15;
        
        function type() {
            if (i < message.length) {
                element.textContent += message.charAt(i);
                i++;
                setTimeout(type, typingSpeed);
                
                // Scroll to bottom as we type
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            } else if (callback) {
                callback();
            }
        }
        
        type();
    }
    
    // Add message to chat
    function addMessage(text, isQuestion = false, isInitialGreeting = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message');
        messageDiv.classList.add(isQuestion ? 'chatbot-question' : 'chatbot-response');
        
        const messageText = document.createElement('p');
        messageDiv.appendChild(messageText);
        
        if (isQuestion) {
            // For questions, show immediately
            messageText.textContent = text;
            chatbotMessages.appendChild(messageDiv);
        } else if (isInitialGreeting) {
            // For initial greeting
            messageText.textContent = text;
            chatbotMessages.appendChild(messageDiv);
        } else {
            // For normal responses
            const typingIndicator = createTypingIndicator();
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            setTimeout(() => {
                // Replace typing indicator with actual message
                typingIndicator.replaceWith(messageDiv);
                typeMessage(text, messageText);
            }, 500 + Math.random() * 500);
        }
        
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Handle sending messages
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatbotInput.value = '';
            
            // Get response after a short delay
            setTimeout(() => {
                const response = getChatbotResponse(message);
                addMessage(response);
            }, 500);
        }
    }
    
function getChatbotResponse(question) {
    const lowerQuestion = question.toLowerCase().trim();
    
    // EXTENSION REQUESTS
    if (/(how|can|what).*(request|get|ask for|apply for).*extension|need more time.*assignment|(extension|late).*policy|(can't|won't).*make.*deadline|(miss|late).*due date|life happens extension/i.test(lowerQuestion)) {
        return "You have one 48-hour 'Life Happens' extension available per semester. Just email me to let me know you'd like to use it—no explanation needed. This extension cannot be used for the final essay. Late work penalties: <1 hour (5%), <24 hours (10%), <1 week (20%), >1 week (max 50%).";
    }
    
    // COURSE BASICS
    if (/what('s| is).*(class|course|engl\s?380|english studies)|(can you|could you).*(tell me|explain).*(about|this).*class|what.*we.*do.*in.*class|describe.*(course|class)|overview.*of.*class|what.*cover.*in.*this.*class|what.*learn.*in.*(this|the).*class|what's.*the.*point.*of.*this.*class|why.*take.*this.*class/i.test(lowerQuestion)) {
        return "ENGL 380 is an advanced course covering research methods; approaches to literary, rhetorical, and pedagogical topics; critical and literary terminology; genre; and advanced skills in writing and analysis. You'll analyze poetry, fiction, drama, and nonfiction, and build research and rhetorical skills. Prerequisite: English 184 or equivalent.";
    }
    
    if (/(what|what's|what will|how).*(learn|gain|get from|take away from).*(class|course)|(skills|outcomes|abilities).*(from|in).*class|why.*take.*this.*class|what's.*the.*point.*of.*this.*class|how.*this.*class.*help.*me|what.*teach.*in.*this.*class|what.*get.*out.*of.*class|how.*improve.*(writing|reading).*in.*this.*class/i.test(lowerQuestion)) {
        return "In this class, you'll learn to: demonstrate advanced writing processes; develop persuasive arguments through close reading; distinguish between literary genres; place literature in socio-historical contexts; use literary terminology; analyze rhetorical strategies; locate and evaluate scholarship; draw connections between texts; and show awareness of pedagogical methods.";
    }
    
    // SCHEDULE & ATTENDANCE
    if (/(when|what time|where|what days).*(class|meet|lecture|session).*(schedule|time|location|room|mhb510)|(class|lecture).*(schedule|time|meet|location)|(day|time).*of.*class|when.*we.*meet|what.*are.*class.*hours|(where|when).*is.*(class|lecture)|how.*often.*we.*meet/i.test(lowerQuestion)) {
        return "Class meets in person. See the syllabus for specific days/times. Instructor office hours: Tues/Thurs 12-2 p.m. in MHB510, plus by appointment.";
    }
    
    if (/(attendance|absent|miss|late|tardy).*(policy|rule|requirement|grade|count|drop)|how many.*(absences|misses|lates).*allowed|what happens if.*(miss|absent|late)|(can|what if) I.*(miss|skip).*class|(number|amount) of.*(absences|misses)|(consequences|penalty).*for.*(missing|absence)|(will|does).*(missing|absence).*(affect|drop).*grade|show up.*required/i.test(lowerQuestion)) {
        return "More than two unexcused absences lowers your final grade by 5% each. More than six results in a 0 for attendance/participation. Excused absences require documentation (illness, family emergency, religious, jury duty, university activities). Two free absences are for minor issues like traffic or minor illness.";
    }
    
    // MATERIALS
    if (/(do|have to|need to|must|should|are we).*(buy|purchase|get|bring|need).*(textbook|book|materials|readings)|(is|are).*textbook.*(required|needed)|(what|which).*books.*(need|required)|(how much|cost).*textbook|(where|how).*get.*textbook|(do we|can I).*use.*(ebook|pdf)|(required|course).*materials/i.test(lowerQuestion)) {
        return "Required texts: 1) Shakespeare's 'Hamlet' (Norton Critical Ed., 2nd), 2) Shelley's 'Frankenstein' (Broadview, 3rd), 3) Stevens' 'Literary Theory and Criticism' (Broadview, 2nd). Additional readings are on Canvas. Use the specified editions.";
    }
    
    // ASSIGNMENTS
    if (/close reading paper|close reading|first paper|short paper/i.test(lowerQuestion)) {
        return "The Close Reading Paper is 1250-1500 words, focusing on a single primary text. You'll argue a thesis with textual evidence. Worth 15% of your grade. You may revise/resubmit after final grades with a 300-word revision statement.";
    }
    
    if (/q h q|qhq|question hypothesis question/i.test(lowerQuestion)) {
        return "QHQs are informal discussion board posts due the night before class. Pose an analytical question, hypothesize an answer with evidence, and end with a new question. 10 of 15 required, each at least 250 words with one citation. Worth 10% of your grade.";
    }
    
    if (/response papers|response assignments/i.test(lowerQuestion)) {
        return "Response Papers are short writing assignments to practice literary scholarship methods. They're low-stakes and build skills for major papers and discussion. Worth 10% of your grade, based on engagement/completion.";
    }
    
    if (/midterm|mid term|exam/i.test(lowerQuestion)) {
        return "The Midterm Exam includes multiple choice, short response, and a close reading written response. It covers lectures and readings. Administered in person on paper on 17 March 2026 during class. Worth 15% of your grade.";
    }
    
    if (/research paper|final paper|theoretical paper|capstone/i.test(lowerQuestion)) {
        return "The Theoretical Paper is 2500-3000 words, using a theoretical/critical lens and at least four scholarly sources. First submit a proposal with annotated bibliography. Worth 25% of your grade. No revisions after deadline.";
    }
    
    if (/quizzes|quiz/i.test(lowerQuestion)) {
        return "Reading quizzes open one week before class and close when class starts. Open-note/open-book. No makeups except for documented excused reasons. Worth 5% of your grade.";
    }
    
    if (/how many.*essays|writing assignments|assignments.*due|workload/i.test(lowerQuestion)) {
        return "Assignments include: Close Reading Paper, QHQs (10 of 15), Response Papers, Midterm Exam, Research Paper, and weekly quizzes. See syllabus for details and due dates.";
    }
    
    // GRADING
    if (/grading scale|how.*graded/i.test(lowerQuestion)) {
        return "Grading scale: A (90-100%), B (80-89%), C (70-79%), D (60-69%), F (Below 60%).";
    }
    
    if (/grade breakdown|grading breakdown|how much is.*worth|what percent of my grade is.*|weight.*assignments|grade.*based.*on|how.*get.*a|how.*pass.*class|how.*pass/i.test(lowerQuestion)) {
        return "Grade breakdown: Attendance/Participation (20%), Quizzes (5%), Midterm (15%), Close Reading Paper (15%), Research Paper (25%), QHQs (10%), Response Papers (10%).";
    }
    
    // POLICIES
    if (/late work|submit.*late|turn in.*late|hand in.*late|late.*turn.*in|late.*submit|late.*hand.*in/i.test(lowerQuestion)) {
        return "Late work penalties: <1 hour (5%), <24 hours (10%), <1 week (20%), >1 week (max 50%). One 48-hour 'Life Happens' extension per semester (not for final paper).";
    }
    
    if (/plagiarism|ai|academic integrity|cheating|turnitin/i.test(lowerQuestion)) {
        return "Plagiarism or unauthorized AI use results in a failing grade. Using GenAI to generate content is not allowed. All work is screened with AI detection tools. You must submit version history for non-handwritten assignments. AI-flagged work receives a zero.";
    }
    
    if (/communication policy|email|contact|office hours|how.*reach.*professor/i.test(lowerQuestion)) {
        return "Email: liliana.desimone@csulb.edu. I respond within 24 hours Mon–Fri (9–5). Office hours: Tues/Thurs 12-2 p.m. in MHB510 + by appointment. Enable Canvas notifications.";
    }
    
    if (/technology policy|laptops|devices|phones|electronics in class/i.test(lowerQuestion)) {
        return "Laptops/devices allowed for notes and course materials. No non-course browsing, earbuds, or texting. Phones silenced. Disruptive use may result in being asked to leave and loss of participation points.";
    }
    
    if (/withdrawal policy|drop.*class|withdraw/i.test(lowerQuestion)) {
        return "Withdrawals during the final three weeks require serious, compelling reasons. You must file withdrawal paperwork with Enrollment Services or receive a 'WU' (unauthorized withdrawal).";
    }
    
    // RESOURCES
    if (/bmac|disability|accommodation|accessibility/i.test(lowerQuestion)) {
        return "Students with disabilities must register with Bob Murphy Access Center (BMAC) each semester and provide accommodation verification early. Contact: (562) 985-5401, bmac@csulb.edu, Shakerian Student Success Center Rm 110.";
    }
    
    if (/resources|support|help|tutoring|writing center|library/i.test(lowerQuestion)) {
        return "See the 'Resources and Support' module on Canvas for academic and student support services (advising, health, counseling, etc.). Technical help: (562) 985-4959, helpdesk@csulb.edu.";
    }
    
    if (/computer.*lab|printing|software|technical support/i.test(lowerQuestion)) {
        return "Open computer labs: Horn Center and Spidell Technology Center (Library). Printing: 10 cents/page with Beach ID. Tech support: (562) 985-4959, helpdesk@csulb.edu.";
    }
    
    // DEFAULT RESPONSE
    return "I'm not sure I understand. Try checking the syllabus, rephrasing your question, or emailing Professor De Simone at liliana.desimone@csulb.edu. You might ask about assignments, policies, grading, or resources.";
}
    
    // Toggle chatbot visibility and show initial greeting
    chatbotToggle.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
        
        // Only add greeting if this is the first open
        if (chatbotWidget.classList.contains('active') && chatbotMessages.children.length === 0) {
            addMessage(
                "Hark, scholars! The ENGL 380 syllabus lies open before thee. Ask of grading, attendance, or the ordinances of the course, and I shall make all plain.",
                false,
                true
            );
        }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        chatbotWidget.classList.remove('active');
    });
    
    // Send message on button click or Enter key
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}
