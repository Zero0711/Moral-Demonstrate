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
let guidelinesAcknowledged = false;

// Function to normalize and check for bad words
function containsBadWords(text) {
    const normalizedText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    return badWords.some(word => normalizedText.includes(word));
}

// Handle key press events, specifically Enter key
function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (event.target.classList.contains('reply-input')) {
            submitReply(event.target.nextElementSibling);
        } else {
            submitComment();
        }
    }
}

// Function to submit a new comment
function submitComment() {
    if (!guidelinesAcknowledged) {
        showModal();
        return;
    }

    if (banned) {
        document.getElementById('ban-message').classList.remove('hidden');
        return;
    }

    const commentInput = document.getElementById('comment-input');
    let commentText = commentInput.value.trim();

    if (commentText.length < 1) {
        return;
    }

    if (commentText === "/help") {
        showHelpModal();
        commentInput.value = '';
        return;
    }

    const now = Date.now();
    recentComments.push({ time: now, text: commentText });
    if (recentComments.length > 3 && now - recentComments[recentComments.length - 3].time < 10000) {
        startCooldown();
        return;
    }

    if (containsBadWords(commentText)) {
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

// Function to submit a reply to an existing comment
function submitReply(button) {
    const replyForm = button.closest('.reply-form');
    const replyInput = replyForm.querySelector('.reply-input');
    const replyText = replyInput.value.trim();

    if (replyText === '') {
        return;
    }

    if (containsBadWords(replyText)) {
        alert('Your reply contains inappropriate language and will not be posted.');
        replyInput.value = '';
        return;
    }

    const commentDiv = button.closest('.comment');
    const repliesDiv = commentDiv.querySelector('.replies');
    addReply("You", replyText, new Date().toLocaleTimeString(), commentIdCounter++, repliesDiv);
    replyInput.value = '';
    replyForm.classList.add('hidden');
}

// Function to add a new comment to the DOM
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
                <button class="reply-button" onclick="showReplyForm(this)">Reply</button>
                <button class="report-button" onclick="reportComment(this)">Report</button>
            </div>
            <div class="reply-form hidden">
                <textarea class="reply-input" placeholder="Write a reply..." onkeypress="handleKeyPress(event)"></textarea>
                <button onclick="submitReply(this)">Submit</button>
            </div>
            <div class="replies"></div>
        </div>
    `;
    commentsDiv.appendChild(newComment);
}

// Function to add a reply to a specific comment
function addReply(username, text, timestamp, id, repliesDiv) {
    const newReply = document.createElement('div');
    newReply.classList.add('comment');
    newReply.setAttribute('data-id', id);
    newReply.innerHTML = `
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
    repliesDiv.appendChild(newReply);
}

// Function to start a cooldown period after detecting inappropriate behavior
function startCooldown() {
    const cooldownMessage = document.getElementById('cooldown-message');
    cooldownMessage.classList.remove('hidden');
    setTimeout(() => {
        cooldownMessage.classList.add('hidden');
    }, 5000);
}

// Function to ban a user from commenting
function banUser() {
    banned = true;
    document.getElementById('comment-input').disabled = true;
    document.querySelector('.comment-form button').disabled = true;
    document.getElementById('ban-message').classList.remove('hidden');
}

// Function to show and hide reply form
function showReplyForm(button) {
    const commentDiv = button.closest('.comment');
    const replyForm = commentDiv.querySelector('.reply-form');
    replyForm.classList.toggle('hidden');
}

// Function to show modal for community guidelines
function showModal() {
    document.getElementById('guidelines-modal').style.display = "block";
}

// Function to close guidelines modal
function closeModal() {
    document.getElementById('guidelines-modal').style.display = "none";
}

// Function to acknowledge guidelines
function acknowledgeGuidelines() {
    guidelinesAcknowledged = true;
    closeModal();
}

// Function to show help modal
function showHelpModal() {
    document.getElementById('help-modal').style.display = "block";
}

// Function to close help modal
function closeHelpModal() {
    document.getElementById('help-modal').style.display = "none";
}

// Function to like a comment
function likeComment(button) {
    const likeCountSpan = button.querySelector('.like-count');
    let likeCount = parseInt(likeCountSpan.textContent);
    likeCount++;
    likeCountSpan.textContent = likeCount;
}

// Function to edit a comment
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

// Function to save an edited comment
function saveEditedComment(editInput) {
    const newText = editInput.value.trim();
    const commentDiv = editInput.closest('.comment');

    if (newText === '') {
        return;
    }

    if (containsBadWords(newText)) {
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

// Function to report a comment
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

// Function to scroll to the bottom of the comments section
function scrollToBottom() {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.scrollTop = commentsDiv.scrollHeight;
}

// Initial call to show the guidelines modal
window.onload = showModal;
