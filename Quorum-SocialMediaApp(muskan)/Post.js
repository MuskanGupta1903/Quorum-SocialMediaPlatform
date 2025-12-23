document.addEventListener('DOMContentLoaded', () => {

    // --- 0️⃣ Load user profile info from localStorage ---
    let userName = "New User";
    let userHandle = "@new_user";
    let avatarUrl = "https://i.pravatar.cc/40?img=20";

    try {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            userName = profile.fullName || userName;
            userHandle = profile.username ? `@${profile.username}` : userHandle;
            if (profile.profileImageBase64) {
                avatarUrl = profile.profileImageBase64;
            }
        }
    } catch (err) {
        console.error("Error reading profile from localStorage:", err);
    }

    // --- 1️⃣ DOM Elements ---
    const postButton = document.querySelector('.create-post button');
    const postTextarea = document.querySelector('.create-post textarea');
    const photoInputTrigger = document.querySelector('.post-options .icons span:nth-child(1)');
    const feedContainer = document.querySelector('.container > div:first-child');

    // Hidden file input for image upload
    let currentFile = null;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // --- 2️⃣ Image Handling ---
    function clearSelectedImage() {
        currentFile = null;
        fileInput.value = '';
        photoInputTrigger.innerHTML = '📷 Photo';
        photoInputTrigger.style.cursor = 'pointer';
    }

    function handleFileSelection(event) {
        currentFile = event.target.files[0];
        if (currentFile) {
            const fileName = currentFile.name.length > 15 ? currentFile.name.substring(0, 15) + '...' : currentFile.name;
            photoInputTrigger.innerHTML = `
                <span style="font-size:14px;">🖼 ${fileName}</span>
                <span class="clear-image-btn" style="color:var(--dark-red); margin-left:10px; font-weight:bold; cursor:pointer;">&times;</span>
            `;
            photoInputTrigger.style.cursor = 'default';
            
            const clearBtn = photoInputTrigger.querySelector('.clear-image-btn');
            if (clearBtn) {
                const newClearBtn = clearBtn.cloneNode(true);
                clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
                newClearBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    clearSelectedImage();
                });
            }
        } else {
            clearSelectedImage();
        }
    }

    photoInputTrigger.addEventListener('click', (e) => {
        if (!e.target.classList.contains('clear-image-btn') && currentFile === null) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', handleFileSelection);

    // --- 3️⃣ Create Post ---
    postButton.addEventListener('click', () => {
        const textContent = postTextarea.value.trim();

        if (textContent === '' && currentFile === null) {
            alert('Please enter text or select an image before posting.');
            return;
        }

        // Convert image to Base64 if selected
        if (currentFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                saveAndDisplayPost(textContent, e.target.result);
            };
            reader.readAsDataURL(currentFile);
        } else {
            saveAndDisplayPost(textContent, null);
        }
    });

    function saveAndDisplayPost(textContent, imageBase64) {
        const newPost = createPostElement(textContent, imageBase64);
        feedContainer.insertBefore(newPost, feedContainer.querySelector('.post'));

        // Save post to localStorage
        const storedPosts = localStorage.getItem('userPosts');
        let postsArray = storedPosts ? JSON.parse(storedPosts) : [];

        const postObject = {
            text: textContent,
            image: imageBase64,
            hashtags: '',
            likes: 0,
            comments: 0,
            shares: 0,
            timeAgo: 'Just now'
        };

        postsArray.unshift(postObject); // newest post first
        localStorage.setItem('userPosts', JSON.stringify(postsArray));

        // Reset form/state
        postTextarea.value = '';
        clearSelectedImage();

        // Initialize interactivity
        initializePostInteractivity(newPost);
    }

    // --- 4️⃣ Function to create post HTML ---
    function createPostElement(text, imageBase64) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        let imageHTML = '';
        if (imageBase64) {
            imageHTML = `<img src="${imageBase64}" style="width:100%; max-height:400px; object-fit:cover; border-radius:6px; margin:10px 0;">`;
        }

        postDiv.innerHTML = `
            <div class="post-header">
                <div class="user">
                    <img src="${avatarUrl}" alt="${userName}">
                    <div>
                        <h3>${userName}</h3>
                        <p>${userHandle} · Just now</p>
                    </div>
                </div>
                <div class="post-menu-trigger">...</div>
            </div>
            <div class="post-content">
                ${text.replace(/\n/g, '<br>')}
                ${imageHTML}
            </div>
            <div class="post-actions">
                <span class="post-action">👍 <span>0</span></span>
                
            </div>
        `;
        return postDiv;
    }

    // --- 5️⃣ Initialize Post Interactivity ---
    function initializePostInteractivity(postElement) {
        const actions = postElement.querySelectorAll('.post-action');
        actions.forEach(action => {
            let isToggled = false;
            const countElem = action.querySelector('span');
            let currentCount = parseInt(countElem.textContent) || 0;

            action.addEventListener('click', () => {
                isToggled = !isToggled;
                if (isToggled) {
                    currentCount++;
                    action.style.color = 'var(--primary-red)';
                    action.style.background = 'var(--light-red)';
                } else {
                    currentCount--;
                    action.style.color = 'var(--text-light)';
                    action.style.background = 'transparent';
                }
                countElem.textContent = currentCount;
            });
        });

        const menuTrigger = postElement.querySelector('.post-menu-trigger');
        if (menuTrigger) {
            menuTrigger.style.cursor = 'pointer';
            menuTrigger.addEventListener('click', () => {
                const existingMenu = postElement.querySelector('.post-delete-menu');
                if (existingMenu) return existingMenu.remove();

                const deleteMenu = document.createElement('div');
                deleteMenu.classList.add('post-delete-menu');
                deleteMenu.style.position = 'absolute';
                deleteMenu.style.right = '0';
                deleteMenu.style.top = '45px';
                deleteMenu.style.background = 'white';
                deleteMenu.style.border = '1px solid #ccc';
                deleteMenu.style.borderRadius = '5px';
                deleteMenu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                deleteMenu.style.zIndex = '100';
                deleteMenu.style.padding = '5px 10px';
                deleteMenu.style.color = 'var(--primary-red)';
                deleteMenu.style.cursor = 'pointer';
                deleteMenu.textContent = '❌ Delete Post';

                const postHeader = postElement.querySelector('.post-header');
                postHeader.style.position = 'relative';

                deleteMenu.addEventListener('click', () => {
                    const storedPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
                    const index = storedPosts.findIndex(p => p.text === postElement.querySelector('.post-content').innerText.trim());
                    if (index > -1) {
                        storedPosts.splice(index, 1);
                        localStorage.setItem('userPosts', JSON.stringify(storedPosts));
                    }
                    postElement.remove();
                });

                postHeader.appendChild(deleteMenu);

                const hideMenu = (event) => {
                    if (!deleteMenu.contains(event.target) && event.target !== menuTrigger) {
                        deleteMenu.remove();
                        document.removeEventListener('click', hideMenu);
                    }
                };
                setTimeout(() => {
                    document.addEventListener('click', hideMenu);
                }, 10);
            });
        }
    }

    // --- 6️⃣ Load existing posts from localStorage on page load ---
    const existingPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
    existingPosts.forEach(post => {
        const postElem = createPostElement(post.text, post.image);
        feedContainer.appendChild(postElem);
        initializePostInteractivity(postElem);
    });

    console.log("Feed and post interactivity initialized successfully.");
});
