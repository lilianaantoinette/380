// Enhanced Custom Cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Cursor hover effects
const interactiveElements = document.querySelectorAll(
    'a, button, .resource-item, .card, .quick-nav a, .nav-links a, li'
);

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-active');
        el.style.transform = 'translateY(-2px)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-active');
        el.style.transform = 'translateY(0)';
    });
});

// Scroll effects
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.syllabus-nav');
    if (window.scrollY > 50) {
        nav.classList.add('syllabus-nav-scrolled');
    } else {
        nav.classList.remove('syllabus-nav-scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });
    });
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

// Chatbot functionality
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
    if (/(how|can|what).*(request|get|ask for|apply for).*extension|need more time.*assignment|(extension|late).*policy|(can't|won't).*make.*deadline|(miss|late).*due date/i.test(lowerQuestion)) {
        return "You have one 48-hour extension available per semester. Email your instructor within 24 hours of the original due date to request it. This extension cannot be used for the final essay or in-class assignments/exams.";
    }
    
    // COURSE BASICS
    if (/what('s| is).*(class|course|engl\s?380|english studies)|(can you|could you).*(tell me|explain).*(about|this).*class|what.*we.*do.*in.*class|describe.*(course|class)|overview.*of.*class|what.*cover.*in.*this.*class|what.*learn.*in.*(this|the).*class|what's.*the.*point.*of.*this.*class|why.*take.*this.*class/i.test(lowerQuestion)) {
        return "ENGL 380 is an advanced course covering research methods, literary approaches, critical terminology, and advanced writing/analysis skills. You'll develop close-reading skills and learn to analyze various texts in cultural and historical contexts.";
    }
    
    if (/(what|what's|what will|how).*(learn|gain|get from|take away from).*(class|course)|(skills|outcomes|abilities).*(from|in).*class|why.*take.*this.*class|what's.*the.*point.*of.*this.*class|how.*this.*class.*help.*me|what.*teach.*in.*this.*class|what.*get.*out.*of.*class|how.*improve.*(writing|reading).*in.*this.*class/i.test(lowerQuestion)) {
        return "In this class, you'll learn advanced writing processes, literary terminology, how to analyze texts in context, understand critical movements, develop persuasive arguments through close reading, locate and evaluate scholarship, and synthesize literary and non-literary cultural expressions.";
    }
    
    // SCHEDULE & ATTENDANCE
    if (/(when|what time|where|what days).*(class|meet|lecture|session).*(schedule|time|location|room|as243)|(class|lecture).*(schedule|time|meet|location)|(day|time).*of.*class|when.*we.*meet|what.*are.*class.*hours|(where|when).*is.*(class|lecture)|how.*often.*we.*meet/i.test(lowerQuestion)) {
        return "Our class meets in person on Mondays and Wednesdays from 2:00–3:50 PM in Room AS243.";
    }
    
    if (/(attendance|absent|miss|late|tardy).*(policy|rule|requirement|grade|count|drop)|how many.*(absences|misses|lates).*allowed|what happens if.*(miss|absent|late)|(can|what if) I.*(miss|skip).*class|(number|amount) of.*(absences|misses)|(consequences|penalty).*for.*(missing|absence)|(will|does).*(missing|absence).*(affect|drop).*grade|show up.*required/i.test(lowerQuestion)) {
        return "More than two unexcused absences will lower your final grade. Excused absences require documentation for illness, family emergencies, religious reasons, jury duty, or university activities.";
    }
    
    // MATERIALS
    if (/(do|have to|need to|must|should|are we).*(buy|purchase|get|bring|need).*(textbook|book|materials|readings)|(is|are).*textbook.*(required|needed)|(what|which).*books.*(need|required)|(how much|cost).*textbook|(where|how).*get.*textbook|(do we|can I).*use.*(ebook|pdf)|(required|course).*materials/i.test(lowerQuestion)) {
        return "Required texts: 1) Garrett-Petts' 'Writing about Literature', 2) Shakespeare's 'Hamlet' (Norton Critical Edition), 3) Shelley's 'Frankenstein' (Broadview Press), and 4) Stevens' 'Literary Theory and Criticism'. All must be the specified editions.";
    }
    
    // ASSIGNMENTS
    if (/how many.*essays|writing assignments/i.test(lowerQuestion)) {
        return "You'll write two major essays: a short paper (1,250–1,500 words) and a final term paper (2,500–3,000 words).";
    }
    
    if (/research paper|final paper|final term paper|big paper/i.test(lowerQuestion)) {
        return "The final term paper is a significant 2,500–3,000 word project that combines close reading with theoretical perspective and is supported by secondary scholarly research.";
    }
    
    if (/annotated bibliography|bibliography/i.test(lowerQuestion)) {
        return "The annotated bibliography requires at least six academic sources from library collections or databases like JSTOR, Project Muse, or MLA Bibliographies. It's worth 10% of your grade.";
    }
    
    if (/conference presentation|presentation/i.test(lowerQuestion)) {
        return "The conference presentation is a 10% component where you'll present your research findings in a conference-style format.";
    }
    
    if (/midterm|exam|quiz|quizzes/i.test(lowerQuestion)) {
        return "There's a midterm exam (10%) with multiple choice, short response, and close reading questions. Regular reading comprehension quizzes (10% total) are administered through Canvas.";
    }
    
    // GRADING
    if (/grading scale|how.*graded/i.test(lowerQuestion)) {
        return "Grading scale: A (90-100%), B (80-89%), C (70-79%), D (60-69%), F (Below 60%). Final grades are not rounded up.";
    }
    
    if (/grade breakdown|grading breakdown|how much is.*worth|what percent of my grade is.*|weight.*assignments|grade.*based.*on|how.*get.*a|how.*pass.*class|how.*pass/i.test(lowerQuestion)) {
        return "Grade composition: Participation (20%), Essays (40% - short paper 15%, final paper 25%), Annotated Bibliography (10%), Exams and Quizzes (20% - midterm 10%, quizzes 10%), Conference Presentation (10%).";
    }
    
    // POLICIES
    if (/late work|submit.*late|turn in.*late|hand in.*late|late.*turn.*in|late.*submit|late.*hand.*in/i.test(lowerQuestion)) {
        return "Late work penalties: <1 hour (5%), 1 class day (10%), 2 class days (20%), >1 week (max 50%). One 48-hour extension available per semester (not for final essay or exams).";
    }
    
    if (/plagiarism|can i use AI|AI|academic integrity/i.test(lowerQuestion)) {
        return "Plagiarism, self-plagiarism, or unauthorized AI use results in a zero and possible course failure. Limited AI use for minor tasks is acceptable but must be cited. All submissions are checked through Turnitin.";
    }
    
    // DEFAULT RESPONSE
    return "I'm not sure I understand. Try checking the syllabus, rephrasing your question, or asking your instructor during office hours.";
}

// Toggle chatbot visibility and show initial greeting
chatbotToggle.addEventListener('click', () => {
    chatbotWidget.classList.toggle('active');
    
    // Only add greeting if this is the first open
    if (chatbotWidget.classList.contains('active') && chatbotMessages.children.length === 0) {
        addMessage(
            "Hello! I can answer questions about the ENGL 380 syllabus. Try asking about grading, attendance, or course policies.",
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
