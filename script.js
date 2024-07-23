const badWords = ["bastard", "bugger", "shit", "fuck", "cibai", "shitface", "bastardson", "punde", "benchod", "motherfucker", "f@ck", "sh!t", "a$$", "b!tch", "m0therfucker", 
    "pussy", "fuckface", "fuck", "shit", "bitch", "asshole", "dick", "piss", "crap", "damn", "cunt", "prick", "fag", 
    "faggot", "slut", "whore", "nigger", "nigga", "cock", "twat", "wanker", "dyke", "bullshit", "douche", "dumbass", 
    "jackass", "jerkoff", "shithead", "tits", "tit", "balls", "bollocks", "chink", "coon", "gook", "heeb", "homo", 
    "kike", "lesbo", "mick", "spic", "tranny", "wetback", "camel jockey", "towelhead", "sandnigger", "jap", "nip", 
    "redskin", "half-breed", "injun", "spade", "zipperhead", "beaner", "gringo", "kraut", "limey", "paki", "raghead", 
    "wop", "yid", "zebra", "abbo", "abo", "bogan", "bint", "hick", "hillbilly", "trailer trash", "gyppo", "chav", 
    "pikey", "redneck", "wigger", "dago", "daggo", "kaffir", "boche", "bogtrottor", "bombchucker", "cheesehead", 
    "chingchong", "coonass", "crackhead", "cracker", "darky", "ding", "eskimo", "flip", "froggy", "greaseball", 
    "guido", "gwailo", "harp", "jigaboo", "junglebunny", "kebab", "mud", "mulatto", "niglet", "oreo", "pavement ape", 
    "pickaninny", "poof", "sambo", "sheep shagger", "skanger", "spook", "squaw", "tarbaby", "teabag", "trog", 
    "uncle tom", "vato", "wetback", "whitey", "wigga", "yank", "zulu", "analfucker", "arsehole", "bitchtits", 
    "cocksucker", "cumdumpster", "cuntface", "dickbag", "dickhead", "dicksneeze", "dickwad", "dickweasel", "dumbfuck", 
    "fuckbag", "fuckboy", "fuckbrain", "fuckhead", "fucknugget", "fuckstick", "fuckwad", "jackoff", "jizzrag", 
    "pissflap", "pisshead", "shitbird", "shitbrick", "shitcunt", "shitdick", "shitgibbon", "shitheel", "shithole", 
    "shitlord", "shitsack", "shitstain", "shitweasel", "twatwaffle", "ching chong", "camel fucker", "beaner", "zipperhead", 
    "camel jockey", "sand nigger", "wetback", "towel head", "ching chong", "bodoh", "bangang", "sial", "cilaka", "puki", "babi", "anjing", "pantat", "pepek", "burit", "butoh", "kontol", "setan", "cabrón", "hijo de puta", "joder", "gilipollas", "pendejo", "puto", "coño", "mierda", "maricón", "zorra",  "con", "connard", "salope", "pute", "merde", "enculé", "bordel", "chier", "baise", "batard",     "arschloch", "fotze", "scheiße", "fick dich", "hurensohn", "miststück", "wichser", "verdammt", "hure", "dummkopf",   "stronzo", "cazzo", "puttana", "merda", "vaffanculo", "bastardo", "coglione", "testa di cazzo", "figlio di puttana",  "klootzak", "hoer", "lul", "schijt", "kut", "godverdomme", "tering", "tyfus", "eikel", "trut",  "merda", "caralho", "puta", "filho da puta", "porra", "cacete", "cu", "bosta", "foda-se", "paneleiro",  "сука", "хуй", "блядь", "мудак", "пиздец", "ебать", "гандон", "пидор", "дерьмо", "жопа", "傻逼", "他妈的", "狗屎", "王八蛋", "操你", "混蛋", "烂货", "婊子", "狗娘养的", "妈的",  "くそ", "馬鹿", "あほ", "ちくしょう", "ふざけるな", "このやろう", "たわけ", "死ね", "うざい", "くそくらえ", "حمار", "غبي", "قذر", "لعنة", "خنزير", "كلب", "زاني", "حقير", "بغي", "مجنون",  "गांडू", "चूतिया", "साला", "मादरचोद", "बहनचोद", "बेवकूफ", "हरामी", "कमीन", "कमीना", "लुच्चा"
];

let badWordCount = 0;
let banned = false;
let commentIdCounter = 4;
let recentComments = [];
let reportedComments = [];
let lastCommentTime = 0;

function normalizeText(text) {
    return text.toLowerCase()
               .replace(/[^a-z0-9]/g, '') // Remove special characters
               .replace(/4/g, 'a')
               .replace(/@/g, 'a')
               .replace(/3/g, 'e')
               .replace(/1/g, 'i')
               .replace(/0/g, 'o')
               .replace(/\$/g, 's');
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitComment();
    }
}

function submitComment() {
    const now = Date.now();
    if (now - lastCommentTime < 5000) { // 5-second cooldown
        alert('You are commenting too quickly. Please wait a moment.');
        return;
    }
    lastCommentTime = now;

    if (banned) {
        document.getElementById('ban-message').classList.remove('hidden');
        return;
    }

    const commentInput = document.getElementById('comment-input');
    let commentText = commentInput.value.trim();

    if (commentText.length < 2) { // Allow very short comments
        return;
    }

    const cooldownMessage = document.getElementById('cooldown-message');

    if (!cooldownMessage.classList.contains('hidden')) {
        return;
    }

    const normalizedText = normalizeText(commentText);

    recentComments.push(normalizedText);
    if (recentComments.length > 10) {
        recentComments.shift();
    }

    if (containsBadWords(normalizedText) || checkRecentComments()) {
        badWordCount++;
        if (badWordCount >= 3) {
            banUser();
        } else {
            startCooldown();
        }
        commentInput.value = '';
        return;
    }

    addComment("You", commentText, new Date().toLocaleTimeString(), commentIdCounter++);
    commentInput.value = '';
    scrollToBottom();
}

function containsBadWords(text) {
    return badWords.some(word => text.includes(word));
}

function checkRecentComments() {
    const combinedText = recentComments.join('');
    return containsBadWords(combinedText);
}

function removeComments() {
    const commentsDiv = document.getElementById('comments');
    const comments = commentsDiv.getElementsByClassName('comment');
    const commentIdsToRemove = [];

    for (let comment of comments) {
        const commentText = normalizeText(comment.querySelector('.comment-text').textContent);
        if (containsBadWords(commentText)) {
            commentIdsToRemove.push(comment.getAttribute('data-id'));
        }
    }

    for (let id of commentIdsToRemove) {
        const commentToRemove = commentsDiv.querySelector(`.comment[data-id="${id}"]`);
        if (commentToRemove) {
            commentToRemove.remove();
        }
    }
}

function addComment(username, text, timestamp, id) {
    const commentsDiv = document.getElementById('comments');
    const newComment = document.createElement('div');
    newComment.classList.add('comment');
    newComment.setAttribute('data-id', id);
    newComment.innerHTML = `
        <img src="avatar.png" alt="User Avatar" class="avatar">
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-username">${username}</span>
                <span class="comment-timestamp">${timestamp}</span>
            </div>
            <div class="comment-text">${text}</div>
            <div class="comment-actions">
                <button class="like-button" onclick="likeComment(this)">Like <span class="like-count">0</span></button>
                ${username === "You" ? '<button class="edit-button" onclick="editComment(this)">Edit</button>' : ''}
                <button class="report-button" onclick="reportComment(this)">Report</button>
            </div>
        </div>
    `;
    commentsDiv.appendChild(newComment);
}

function startCooldown() {
    const cooldownMessage = document.getElementById('cooldown-message');
    cooldownMessage.classList.remove('hidden');

    setTimeout(() => {
        cooldownMessage.classList.add('hidden');
    }, 5000);
}

function banUser() {
    banned = true;
    document.getElementById('comment-input').disabled = true;
    document.querySelector('.comment-form button').disabled = true;
    document.getElementById('ban-message').classList.remove('hidden');
}

function likeComment(button) {
    const likeCountSpan = button.querySelector('.like-count');
    let likeCount = parseInt(likeCountSpan.textContent);
    likeCount++;
    likeCountSpan.textContent = likeCount;
}

function reportComment(button) {
    const commentDiv = button.closest('.comment');
    const commentId = commentDiv.getAttribute('data-id');
    if (!reportedComments.includes(commentId)) {
        reportedComments.push(commentId);
        commentDiv.classList.add('reported');
        alert('Comment reported. Thank you for your feedback.');
    } else {
        alert('This comment has already been reported.');
    }
}

function editComment(button) {
    const commentDiv = button.closest('.comment');
    const commentTextDiv = commentDiv.querySelector('.comment-text');
    const originalText = commentTextDiv.textContent;

    const editInput = document.createElement('textarea');
    editInput.className = 'edit-input';
    editInput.value = originalText;
    editInput.onkeypress = handleKeyPress;
    commentTextDiv.replaceWith(editInput);

    button.textContent = 'Save';
    button.onclick = () => saveEditedComment(editInput);
}

function saveEditedComment(editInput) {
    const newText = editInput.value.trim();
    const commentDiv = editInput.closest('.comment');

    if (newText === '') {
        return;
    }

    const normalizedText = normalizeText(newText);
    if (containsBadWords(normalizedText)) {
        startCooldown();
        commentDiv.remove();
        return;
    }

    const commentTextDiv = document.createElement('div');
    commentTextDiv.className = 'comment-text';
    commentTextDiv.textContent = newText.charAt(0).toUpperCase() + newText.slice(1);
    editInput.replaceWith(commentTextDiv);

    const editButton = commentDiv.querySelector('.edit-button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editComment(editButton);
}

function scrollToBottom() {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.scrollTop = commentsDiv.scrollHeight;
}
