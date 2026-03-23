
import star from './images/star.svg';
import demo from './images/demo.svg';
import source from './images/code.svg';
let msg = "%c Hi 👋! Welcome to my Portfolio, hope you will enjoy it!😊"; 
let styles= [ 
    'font-size: 12px', 
    'font-family: monospace', 
    'background: #020916',    
    'display: inline-block', 
    'color: #70FF00', 
    'padding: 8px 19px', 
    'border: 1px dashed'
].join(';') 
console.log(msg, styles);



const projectContainer = document.querySelector('.project--js');

const username = 'NoriFe'
const description = ''

fetch(`https://api.github.com/users/${username}/repos`)
.then(response => response.json())
.then(response => {
    for (let repository of response) {
const {description, homepage, html_url, name, stargazers_count, topics} = repository;

let tags =``;
for (let tag of topics) {
    tags += `<li class="bg-gray-400/10 py-1 px-2 rounded text-sm font-bold">${tag}</li>`
   
}


const element = `<article class="rounded-rad md:rounded-rad-xl overflow-clip bg-gradient-to-br from-white/10 to-white/5 flex flex-col h-full">
<div class="border-b border-bg shadow-inner-light rounded-t-rad md:rounded-t-rad-xl flex gap-1.5 p-4 h-11 bg-gradient-to-br from-white/10 to-white/5 ">
    <span class="w-3 h-3 block rounded-full bg-bg opacity-50"></span>
    <span class="w-3 h-3 block rounded-full bg-bg opacity-50"></span>
    <span class="w-3 h-3 block rounded-full bg-bg opacity-50"></span>
</div>
<div class="p-5 md:p-6 lg:p-10 flex flex-col justify-between grow ring-1 ring-inset ring-bg">
<div>
    <header class="mb-4 flex gap-4 items-center">
<h3 class="text-2xl leading-none font-bold">${name}</h3>
<p class=" bg-gray-400/10 py-1 px-2 flex gap-0.5 items-center
 text-gray-400 font-medium leading-none rounded">
 <img src="${star}" alt="" class="w-4 h-4" />${stargazers_count}</p>
</header>
<p class="text-gray-400 text-xl mb-4">
${description}
</p>
<ul class="flex gap-2 mb-10 flex-wrap">
${tags}

</ul>
</div>
<div class="flex flex-col flex-wrap md:flex-row gap-4 items-start">
<a class="bg-bg text-accent border-gray-800 border-2 flex gap-3 font-bold  
py-4 px-5 items-center rounded-rad md:rounded-rad-xl md:text-xl hover:border-accent transition-colors duration-500" rel="noreferrer nofollow" target="_blank" 
href="${homepage}"><img src="${demo}" class="w-6 h-6" width="24" height="24"alt=""> View demo</a>
<a class="bg-bg text-accent border-gray-800 border-2 flex gap-3 font-bold  
py-4 px-5 items-center rounded-rad md:rounded-rad-xl md:text-xl hover:border-accent transition-colors duration-500" rel="noreferrer nofollow" target="_blank" 
href="${html_url}"><img src="${source}" class="w-6 h-6" width="24" height="24" alt="">Source code</a>
</div>
</article>`;
if (description)
projectContainer.insertAdjacentHTML('afterbegin', element) 
    }
})
.catch((e) => console.log(e));

const aiLauncher = document.querySelector('#aiLauncher');
const aiChatPanel = document.querySelector('#aiChatPanel');
const aiChatClose = document.querySelector('#aiChatClose');
const aiChatInput = document.querySelector('#aiChatInput');
const aiChatComposer = document.querySelector('.ai-chat-panel__composer');
const aiChatMessages = document.querySelector('#aiChatMessages');
const aiChatSend = document.querySelector('#aiChatSend');

const chatHistory = [];

const addChatMessage = (role, text, extraClass = '') => {
    if (!aiChatMessages) {
        return null;
    }

    const messageNode = document.createElement('article');
    const roleClass = role === 'user' ? 'ai-chat-message--user' : 'ai-chat-message--bot';
    messageNode.className = `ai-chat-message ${roleClass}${extraClass ? ` ${extraClass}` : ''}`;
    messageNode.textContent = text;
    aiChatMessages.appendChild(messageNode);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    return messageNode;
};

const setComposerState = (isSending) => {
    if (aiChatSend) {
        aiChatSend.disabled = isSending;
    }
    if (aiChatInput) {
        aiChatInput.disabled = isSending;
    }
};

const requestChatReply = async (message) => {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            message,
            history: chatHistory
        })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload.error || 'Chat service unavailable');
    }

    return payload.reply;
};

if (aiLauncher) {
    const aiLauncherWrap = aiLauncher.closest('.ai-launcher-wrap');

    const syncLauncherState = () => {
        const isExpanded = aiLauncher.getAttribute('aria-expanded') === 'true';
        if (aiLauncherWrap) {
            aiLauncherWrap.classList.toggle('is-open', isExpanded);
        }
        if (aiChatPanel) {
            aiChatPanel.setAttribute('aria-hidden', String(!isExpanded));
        }
        if (isExpanded && aiChatInput) {
            window.setTimeout(() => aiChatInput.focus(), 140);
        }
    };

    syncLauncherState();

    aiLauncher.addEventListener('click', () => {
        const isExpanded = aiLauncher.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;

        aiLauncher.setAttribute('aria-expanded', String(nextState));
        syncLauncherState();
    });

    if (aiChatClose) {
        aiChatClose.addEventListener('click', () => {
            aiLauncher.setAttribute('aria-expanded', 'false');
            syncLauncherState();
            aiLauncher.focus();
        });
    }

    if (aiChatComposer) {
        aiChatComposer.addEventListener('submit', async (event) => {
            event.preventDefault();

            const value = (aiChatInput?.value || '').trim();
            if (!value) {
                return;
            }

            addChatMessage('user', value);
            chatHistory.push({ role: 'user', text: value });

            if (aiChatInput) {
                aiChatInput.value = '';
            }

            setComposerState(true);
            const typingNode = addChatMessage('assistant', 'Thinking...', 'ai-chat-message--typing');

            try {
                const reply = await requestChatReply(value);
                if (typingNode) {
                    typingNode.remove();
                }
                addChatMessage('assistant', reply);
                chatHistory.push({ role: 'assistant', text: reply });
            } catch (error) {
                if (typingNode) {
                    typingNode.remove();
                }
                const fallback = 'I had trouble reaching the chat service. Please try again in a moment.';
                addChatMessage('assistant', fallback);
                chatHistory.push({ role: 'assistant', text: fallback });
            } finally {
                setComposerState(false);
                if (aiChatInput) {
                    aiChatInput.focus();
                }
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && aiLauncher.getAttribute('aria-expanded') === 'true') {
            aiLauncher.setAttribute('aria-expanded', 'false');
            syncLauncherState();
            aiLauncher.focus();
        }
    });
}
  

