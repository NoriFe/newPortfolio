import star from './images/star.svg';
import demo from './images/demo.svg';
import source from './images/code.svg'

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

const element = `<article class="rounded-rad md:rounded-rad-xl overflow-clip bg-gradient-to-br from-white/10 to-white/5">
<div class="border-b border-bg shadow-innerLight rounded-t-rad md:rounded-t-rad-xl flex gap-1.5 p-4 h-11 bg-gradient-to-br from-white/10 to-white/5 ">
    <span class="w-3 h-3 block rounded-full bg-bg opacity-50"></span>
    <span class="w-3 h-3 block rounded-full bg-bg opacity-50"></span>
    <span class="w-3 h-3 block rounded-full bg-bg opacity-50"></span>
</div>
<div class="p-5 md:p-6 lg:p-10">
    <header class="mb-4 flex gap-4 items-center">
<h3 class="text-2xl leading-none font-bold">${name}</h3>
<p class=" bg-gray-400/10 py-1 px-2 flex gap-0.5 items-center
 text-gray-400 font-medium leading-none rounded">
 <img src="${star}" alt="" class="w-4 h-4" />${stargazers_count}</p>
</header>
<p class="text-gray-400 text-xl mb-4">
${description}
</p>
<ul class="flex gap-2 mb-10">
${tags}

</ul>
<div class="flex flex-col md:flex-row gap-4 items-start">
<a class="bg-bg text-accent border-lightGray border-2 flex gap-3 font-bold  
py-4 px-5 items-center rounded-rad md:rounded-rad-xl md:text-xl" rel="noreferrer nofollow" target="_blank" 
href="${homepage}"><img class="w-6 h-6" src="${demo}" alt=""> View demo</a>
<a class="bg-bg text-accent border-lightGray border-2 flex gap-3 font-bold  
py-4 px-5 items-center rounded-rad md:rounded-rad-xl md:text-xl" rel="noreferrer nofollow" target="_blank" 
href="${html_url}"><img src="${source}" alt="">Source code</a>
</div>
</article>`;
if (description)
projectContainer.insertAdjacentHTML('afterbegin', element) 
    }
})
.catch((e) => console.log(e));


