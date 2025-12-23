document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Element Mapping ---
    const profilePicElement = document.querySelector('.profile-pic');
    const fullNameElement = document.querySelector('.profile-info h2');
    const usernameElement = document.querySelector('.username');
    const locationElement = document.querySelector('.location-join span:first-child');
    const joinDateElement = document.querySelector('.location-join span:last-child');
    const bioElement = document.querySelector('.bio');
    const departmentLink = document.querySelector('.department');
    const followersNumber = document.querySelector('.stat:nth-child(1) .stat-number');
    const followingNumber = document.querySelector('.stat:nth-child(2) .stat-number');
    const postsNumber = document.querySelector('.stat:nth-child(3) .stat-number');
    const interestTagsContainer = document.querySelector('.interest-tags');

    const postsContainer = document.querySelector('.posts-section');

    // --- 2. Data Retrieval and Parsing ---
    const storedData = localStorage.getItem('userProfile');

    if (!storedData) {
        alert('No profile data found. Please complete your profile first.');
        return;
    }

    const profile = JSON.parse(storedData);
    console.log('Profile data loaded:', profile);

    // --- 3. Dynamic Content Update ---
    function getInitials(fullName) {
        if (!fullName) return '?';
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    // Update profile picture
    const postAvatars = document.querySelectorAll('.post-avatar');
    if (profile.profileImageBase64) {
        profilePicElement.style.backgroundImage = `url(${profile.profileImageBase64})`;
        profilePicElement.style.backgroundSize = 'cover';
        profilePicElement.style.backgroundPosition = 'center';
        profilePicElement.style.fontSize = '0';
        profilePicElement.textContent = '';

        postAvatars.forEach(avatar => {
            avatar.style.backgroundImage = `url(${profile.profileImageBase64})`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.style.fontSize = '0';
            avatar.textContent = '';
        });
    } else {
        const initials = getInitials(profile.fullName);
        profilePicElement.textContent = initials;
        postAvatars.forEach(avatar => avatar.textContent = initials);
    }

    // Update text content
    fullNameElement.textContent = profile.fullName || 'User Name';
    usernameElement.textContent = `@${profile.username}` || '@user';

    const displayDepartment = profile.department ?
        profile.department.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') :
        'Department';
    departmentLink.textContent = displayDepartment;
    departmentLink.href = `#${profile.department}`;
    bioElement.textContent = profile.bio || 'This user has not written a bio yet.';
    locationElement.innerHTML = `📍 ${profile.location}`;
    joinDateElement.innerHTML = `📅 Joined ${profile.joinDate}`;

    // Update stats
    followersNumber.textContent = profile.followers || '0';
    followingNumber.textContent = profile.following || '0';
    postsNumber.textContent = profile.posts || '0';

    // Update interests
    interestTagsContainer.innerHTML = '';
    if (profile.interests && profile.interests.length > 0) {
        profile.interests.forEach(interest => {
            const displayText = interest.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const tag = document.createElement('span');
            tag.className = 'interest-tag';
            tag.textContent = displayText;
            interestTagsContainer.appendChild(tag);
        });
    } else {
        interestTagsContainer.innerHTML = '<span class="comments-disabled">No interests selected.</span>';
    }

    // --- 4. Load User Posts from LocalStorage ---
    const storedPosts = localStorage.getItem('userPosts'); // array of post objects
    if (storedPosts) {
        const posts = JSON.parse(storedPosts);

        // Remove existing dummy posts
        const dummyPosts = postsContainer.querySelectorAll('.post');
        dummyPosts.forEach(post => post.remove());

        posts.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';

            // Prepare avatar or initials
            let avatarHTML = profile.profileImageBase64 ? '' : getInitials(profile.fullName);

            // Handle image display
            let postImageHTML = '';
            if (post.image) {
                postImageHTML = `<img src="${post.image}" style="width:100%; max-height:400px; object-fit:cover; border-radius:6px; margin:10px 0;">`;
            }

            postDiv.innerHTML = `
                <div class="post-header" style="display:flex; align-items:center;">
                    <div class="post-avatar" ${profile.profileImageBase64 ? `style="background-image:url(${profile.profileImageBase64}); background-size:cover; background-position:center; font-size:0"` : ''}>${avatarHTML}</div>
                    <div class="post-user" style="margin-left:10px;">
                        <h3>${profile.fullName}</h3>
                        <p>@${profile.username} • ${post.timeAgo || 'Just now'}</p>
                    </div>
                    <div class="post-delete" style="cursor:pointer; color:var(--primary-red); margin-left:auto;">❌</div>
                </div>
                <div class="post-content">${post.text.replace(/\n/g, '<br>')}</div>
                ${postImageHTML}
                <div class="post-hashtags">${post.hashtags || ''}</div>
                <div class="post-actions">
                    
                    <div class="post-action">👍 ${post.likes || 0}</div>
                    
                </div>
            `;

            // Delete post functionality
            const deleteBtn = postDiv.querySelector('.post-delete');
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this post?')) {
                    postsContainer.removeChild(postDiv);
                    // Remove from localStorage
                    posts.splice(index, 1);
                    localStorage.setItem('userPosts', JSON.stringify(posts));
                }
            });

            postsContainer.appendChild(postDiv);
        });
    }
});
