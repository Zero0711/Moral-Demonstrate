const badWords = ["bastard", "bugger", "shit", "fuck", "cibai", "shitface", "bastardson", "punde", "benchod", "motherfucker", "pussy", "fuckface", "fuck", "shit", "bitch", "asshole", "bastard", "dick", "piss", "crap", "damn", "cunt", "prick", "fag", "faggot", "slut", "whore", "nigger", "nigga", "motherfucker", "cock", "pussy", "twat", "wanker", "dyke", "ass", "bullshit", "douche", "dumbass", "jackass", "jerkoff", "shithead", "shitface", "tits", "tit", "balls", "bollocks", "bugger", "chink", "coon", "gook", "heeb", "homo", "kike", "lesbo", "mick", "spic", "tranny", "wetback", "camel jockey", "towelhead", "sandnigger", "jap", "nip", "redskin", "half-breed", "injun", "spade", "zipperhead", "beaner", "gringo", "kraut", "limey", "paki", "raghead", "wop", "yid", "zebra", "abbo", "abo", "bogan", "bint", "hick", "hillbilly", "trailer trash", "gyppo", "chav", "pikey", "redneck", "wigger", "dago", "daggo", "kafir", "kaffir", "boche", "bogtrottor", "bombchucker", "cheesehead", "chingchong", "coonass", "crackhead", "cracker", "darky", "ding", "eskimo", "flip", "froggy", "greaseball", "guido", "gwailo", "harp", "jigaboo", "junglebunny", "kebab", "mud", "mulatto", "niglet", "oreo", "pavement ape", "pickaninny", "poof", "raghead", "sambo", "sheep shagger", "skanger", "spook", "squaw", "tarbaby", "teabag", "trog", "uncle tom", "vato", "wetback", "whitey", "wigga", "yank", "zulu", "analfucker", "arsehole", "bastard", "bitchtits", "cocksucker", "cumdumpster", "cuntface", "dickbag", "dickhead", "dicksneeze", "dickwad", "dickweasel", "dumbfuck", "fuckbag", "fuckboy", "fuckbrain", "fuckface", "fuckhead", "fucknugget", "fuckstick", "fuckwad", "jackoff", "jizzrag", "pissflap", "pisshead", "shitbird", "shitbrick", "shitcunt", "shitdick", "shitgibbon", "shitheel", "shithole", "shitlord", "shitsack", "shitstain", "shitweasel", "twatwaffle"];

let badWordCount = 0;
let banned = false;
let commentIdCounter = 4;

function handleKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (event.target.classList.contains('edit-input')) {
            saveEditedComment(event.target);
        } else {
            submitComment();
        }
    }
}

function submitComment() {
    if (banned) {
        document.getElementById('ban-message').classList.remove('hidden');
        return;
    }

    const commentInput = document.getElementById('comment-input');
    let commentText = commentInput.value.trim();
    const cooldownMessage = document.getElementById('cooldown-message');

    if (cooldownMessage.classList.contains('hidden') === false || commentText === '') {
        return;
    }

    if (commentText.length > 0) {
        commentText = commentText.charAt(0).toUpperCase() + commentText.slice(1);
    }

    if (containsBadWords(commentText.toLowerCase())) {
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
    const normalizedText = text.replace(/\s+/g, '').toLowerCase(); // Remove spaces
    for (let word of badWords) {
        if (text.includes(word) || normalizedText.includes(word)) {
            return true;
        }
    }
    return false;
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
    }, 5000); // Cooldown period of 5 seconds
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

    if (containsBadWords(newText.toLowerCase())) {
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
