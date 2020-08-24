let speedchat = document.getElementById('msgs');
speedchat.style.display = "none";
speedchat.id = 'msgs-old';
speedchat.name = 'msgs-old';

const speedChatPlus = document.createElement('input');
speedChatPlus.id = 'msgs';
speedChatPlus.name = 'msgs';
speedChatPlus.type = 'text';

speedchat.after(speedChatPlus);
