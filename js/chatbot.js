const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion-list .suggestion");
const toggleThemeButton = document.querySelector("#toggle-theme-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

let userMessage = null;
let isResponseGenerating = false;

//API configuration
const API_KEY = "";
const API_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const loadLocalstorageData = () => {
    const savedChats = localStorage.getItem("savedChats");
    const islightMode = (localStorage.getItem("themeColor") === "light_mode");

    //apply the stord theme
    document.body.classList.toggle("light_mode", islightMode);
    toggleThemeButton.innerText = islightMode ? "dark_mode" : "light_mode";

    //restore saved chats
    chatList.innerHTML = savedChats || "";

    document.body.classList.toggle("hide-header", savedChats);
    chatList.scrollTo(0, chatList.scrollHeight);//scroll to bottom 
}

loadLocalstorageData();

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

//show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        //append each word to the text element with a spase
        textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
        incomingMessageDiv.querySelector(".icon").classList.add("hide");

        //if all words are displayed
        if(currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isResponseGenerating = false;
            incomingMessageDiv.querySelector(".icon").classList.remove("hide");
            localStorage.setItem("savedChats", chatList.innerHTML);//save chats to local storage
        }
        chatList.scrollTo(0, chatList.scrollHeight);//scroll to bottom 
    }, 75);
}

// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text"); //get text element

    //send POST request to API with the users's messgae
    try {
        const response = await fetch(API_URL,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{text: userMessage}]
                }]
            })
        });

    const data = await response.json();
    if(!response.ok) throw new Error(data.error.message);

    //get the api response text
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    showTypingEffect(apiResponse, textElement, incomingMessageDiv);
    } catch (error) {
        isResponseGenerating = false;
        textElement.innerText = error.message;
        textElement.classList.add("error");
    } finally{
        incomingMessageDiv.classList.remove("loading");
    }
}

// Show loading animation while waiting for the api response
const showLoadingAnimation = () => {
    const html = `<div class="message-content">
                <img src="media/gemini.svg" alt="Gemini Image" class="avatar">
                <p class="text"></p>
                    <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    </div>
                </div>
                <span onclick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
chatList.appendChild(incomingMessageDiv);

chatList.scrollTo(0, chatList.scrollHeight);//scroll to bottom 
generateAPIResponse(incomingMessageDiv);
}

//Copy message to clipboard
const copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(messageText);
    copyIcon.innerText = "done"; //show tick icon
    setTimeout(() => copyIcon.innerText = "content_copy",1000);// revert icon after 1 second
}

//handle sending outgoing chat messages
const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
    if (!userMessage || isResponseGenerating) return;

    isResponseGenerating = true;

    const html = `<div class="message-content">
                <img src="media/user.jpg" alt="User Image" class="avatar">
                <p class="text"></p>
                </div>`;

    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    outgoingMessageDiv.querySelector(".text").innerText = userMessage;
    chatList.appendChild(outgoingMessageDiv);

    typingForm.reset(); //clear input field
    chatList.scrollTo(0, chatList.scrollHeight);//scroll to bottom 
    document.body.classList.add("hide-header");//hide the header once chat start
    setTimeout(showLoadingAnimation, 500); //show loading animation after a delay
}

//set usermessage and handel outgoing chat when a suggestion is clicked
suggestions.forEach(suggestion => {
    suggestion.addEventListener("click", () => {
        userMessage = suggestion.querySelector(".text").innerText;
        handleOutgoingChat();
    });
});

//Toggle between light and dark mode
toggleThemeButton.addEventListener("click", () => {
    const islightMode = document.body.classList.toggle("light_mode");
    localStorage.setItem("themeColor", islightMode ? "light_mode" : "dark_mode");
    toggleThemeButton.innerText = islightMode ? "dark_mode" : "light_mode";
});

//delete all chat messages
deleteChatButton.addEventListener("click", () => {
    if(confirm("are you sure you want to dlete all messages?")){
        localStorage.removeItem("savedChats");
        loadLocalstorageData();
    }
});

//Prevent default form submission and handle outgoing 
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingChat();
});