const tasksDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const formAlertDOM = document.querySelector('.form-alert');

// === TWO-STAGE SPLASH PAGE TRANSITIONS ===
const splashPage = document.getElementById('splash-page');
const dashboardPage = document.getElementById('dashboard-page');
const enterCmd = document.querySelector('.enter-cmd');
const backToOrbitBtn = document.getElementById('back-to-orbit');
const splineBg = document.querySelector('.spline-bg');

// Function to trigger Dashboard entry
const enterDashboard = () => {
  splashPage.classList.add('dive-in');
  dashboardPage.classList.add('dashboard-active');

  if (!splineBg.src && splineBg.dataset.src) {
    splineBg.src = splineBg.dataset.src;
  }

  // Persist state so refresh doesn't kick user back to splash
  sessionStorage.setItem('dashboardActive', 'true');
};

// Check if user refreshed while on dashboard
if (sessionStorage.getItem('dashboardActive') === 'true') {
  // Disable transition temporarily to prevent "flashing" from splash to dashboard on load
  splashPage.style.transition = 'none';
  dashboardPage.style.transition = 'none';

  enterDashboard();

  // Restore transition after a tiny delay so future clicks animate smoothly
  setTimeout(() => {
    splashPage.style.transition = '';
    dashboardPage.style.transition = '';
  }, 50);
}

// Transition: Enter Dashboard (Click Handler)
enterCmd.addEventListener('click', enterDashboard);

// Transition: Back to Splash Page
backToOrbitBtn.addEventListener('click', () => {
  splashPage.classList.remove('dive-in');
  dashboardPage.classList.remove('dashboard-active');
  sessionStorage.removeItem('dashboardActive');
});

// === BACKGROUND PRE-WARMING ===
// Quietly load and compile the heavy dashboard Spline scene in the background
// 2.5s after the initial Splash page has stabilized to prevent initial click lag.
// This relies on CSS visibility: hidden to throttle the WebGL context when inactive.
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!splineBg.src && splineBg.dataset.src) {
      splineBg.src = splineBg.dataset.src;
    }
  }, 2500);
});

// Pagination State & DOM
let currentPage = parseInt(localStorage.getItem('taskManagerPage')) || 1;
const tasksPerPage = 3;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageIndicator = document.getElementById('page-indicator');
let globalTasks = []; // store fetched tasks locally

// Load tasks from /api/v1/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible';
  try {
    const response = await axios.get('/api/v1/tasks', {
      headers: {
        'Cache-Control': 'no-cache',
      },
      params: {
        t: new Date().getTime(), // bust cache with timestamp
      },
    });

    console.log('GET /api/v1/tasks response:', response);

    const { tasks } = response.data;

    if (!Array.isArray(tasks)) {
      throw new Error('Invalid tasks format');
    }

    // Reverse the array to implement LIFO (Newest First) sorting
    globalTasks = tasks.reverse();
    renderTasks();
  } catch (error) {
    console.error('Error in showTasks():', error.response?.data || error.message);
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = 'hidden';
};

const renderTasks = (animationClass = 'slideUpFade-anim') => {
  if (globalTasks.length < 1) {
    // Check if we should show Inbox Zero badge (set by delete handler)
    if (window._showInboxZero) {
      window._showInboxZero = false;
      tasksDOM.innerHTML = `
        <div class="inbox-zero-badge">
          ✦ Inbox Zero — You are caught up ✦
        </div>
      `;
    } else {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
    }
    updatePaginationControls(0);
    return;
  }

  const totalPages = Math.ceil(globalTasks.length / tasksPerPage);

  // Ensure currentPage is valid after potential deletions
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  // Persist current page so returning from Edit screen remembers your spot
  localStorage.setItem('taskManagerPage', currentPage);

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const paginatedTasks = globalTasks.slice(startIndex, endIndex);

  const allTasks = paginatedTasks.map(({ completed, _id, name }, index) => {
    const delayStyle = animationClass === 'flip-in'
      ? `animation-delay: ${index * 0.08}s; opacity: 0;`
      : `animation-delay: ${index * 0.08}s;`;
    return `
    <div class="single-task ${completed ? 'task-completed' : ''} ${animationClass === 'flip-in' ? 'flip-in' : ''}" style="${delayStyle}">
      <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
      <div class="task-links">
        <a href="task.html?id=${_id}" class="edit-link"><i class="fas fa-edit"></i></a>
        <button type="button" class="delete-btn" data-id="${_id}"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `;
  }).join('');

  // Re-trigger CSS animation
  tasksDOM.innerHTML = '';
  setTimeout(() => {
    tasksDOM.innerHTML = allTasks;

    // === PAGE CLEAR SURGE ===
    // Check if ALL tasks in the entire database are completed
    const allCompleted = globalTasks.length > 0 && globalTasks.every(t => t.completed);
    if (allCompleted) {
      const cards = tasksDOM.querySelectorAll('.single-task');
      // Trigger domino cascade after a brief delay to let cards render
      setTimeout(() => {
        cards.forEach((card, i) => {
          card.style.animationDelay = `${i * 0.1}s`;
          card.classList.add('domino-out');
        });
        // Show badge after cascade
        setTimeout(() => {
          tasksDOM.innerHTML += `
            <div class="all-complete-badge">
              ✦ All Tasks Completed ✦
            </div>
          `;
        }, 500 + (cards.length - 1) * 100);
      }, 600);
    }
  }, 10);

  updatePaginationControls(totalPages);
};

const updatePaginationControls = (totalPages) => {
  if (totalPages <= 1) {
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    prevBtn.style.visibility = 'hidden';
    nextBtn.style.visibility = 'hidden';
    pageIndicator.style.visibility = 'hidden';
  } else {
    prevBtn.style.visibility = 'visible';
    nextBtn.style.visibility = 'visible';
    pageIndicator.style.visibility = 'visible';
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }
};

// === 3D FLIP PAGINATION ===
const flipAndChangePage = (direction) => {
  const cards = tasksDOM.querySelectorAll('.single-task');
  if (cards.length === 0) {
    // No cards to animate, just change page
    if (direction === 'next') currentPage++;
    else currentPage--;
    renderTasks('flip-in');
    return;
  }

  // Flip out current cards with stagger
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
    card.classList.add('flip-out');
  });

  // After flip-out completes, change page and flip in new cards
  setTimeout(() => {
    if (direction === 'next') currentPage++;
    else currentPage--;
    renderTasks('flip-in');
  }, 450 + (cards.length - 1) * 100);
};

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    flipAndChangePage('prev');
  }
});

nextBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(globalTasks.length / tasksPerPage);
  if (currentPage < totalPages) {
    flipAndChangePage('next');
  }
});

showTasks();

// === VOID DELETION ANIMATION ===
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target;
  // Find the delete button (could be the icon or the button itself)
  const deleteBtn = el.closest('.delete-btn');
  if (!deleteBtn) return;

  const id = deleteBtn.dataset.id;
  const card = deleteBtn.closest('.single-task');
  const isLastTask = globalTasks.length === 1;

  if (card) {
    if (isLastTask) {
      // === INBOX ZERO: ABYSS DROP ===
      card.classList.add('abyss-drop');
    } else {
      // Normal void-delete
      card.classList.add('void-delete');
    }

    // Wait for animation to finish
    await new Promise(resolve => {
      card.addEventListener('animationend', resolve, { once: true });
      setTimeout(resolve, isLastTask ? 800 : 700);
    });
  }

  // Flag for inbox zero badge
  if (isLastTask) {
    window._showInboxZero = true;
  }

  // Now perform the actual deletion
  loadingDOM.style.visibility = 'visible';
  try {
    await axios.delete(`/api/v1/tasks/${id}`);
    await showTasks();
  } catch (error) {
    console.error('Error deleting task:', error.response?.data || error.message);
  }
  loadingDOM.style.visibility = 'hidden';
});

// Create task
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value.trim();

  if (!name) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Task name cannot be empty';
    formAlertDOM.classList.add('text-danger');
    formAlertDOM.classList.remove('text-success');
    return;
  }

  try {
    await axios.post('/api/v1/tasks', { name });

    try {
      currentPage = 1; // Reset to first page when new task is added
      localStorage.setItem('taskManagerPage', currentPage);
      await showTasks();
    } catch (err) {
      console.error('Error in showTasks after POST:', err);
    }

    taskInputDOM.value = '';
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Success, task added';
    formAlertDOM.classList.add('text-success');
    formAlertDOM.classList.remove('text-danger');
  } catch (error) {
    console.error('Caught error:', error);
    console.error('Response:', error.response);
    console.error('Message:', error.response?.data?.message);
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent =
      error.response?.data?.message || 'There was an error, please try again';
    formAlertDOM.classList.add('text-danger');
    formAlertDOM.classList.remove('text-success');
  }

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success', 'text-danger');
  }, 3000);
});

// ============================================
// 3D INTERACTIVE HOVER TILT + GLARE
// ============================================
// Delegated event on .tasks container — works for dynamically created cards
const TILT_MAX = 12; // max degrees of tilt

tasksDOM.addEventListener('mousemove', (e) => {
  const card = e.target.closest('.single-task');
  if (!card || card.classList.contains('void-delete') || card.classList.contains('flip-out')) return;

  const rect = card.getBoundingClientRect();
  const cardCenterX = rect.left + rect.width / 2;
  const cardCenterY = rect.top + rect.height / 2;

  // Normalized -1 to 1 based on cursor position within the card
  const normalizedX = (e.clientX - cardCenterX) / (rect.width / 2);
  const normalizedY = (e.clientY - cardCenterY) / (rect.height / 2);

  // Clamp values
  const clampedX = Math.max(-1, Math.min(1, normalizedX));
  const clampedY = Math.max(-1, Math.min(1, normalizedY));

  // rotateY follows X (tilt left/right), rotateX follows inverted Y (tilt up/down)
  const rotateY = clampedX * TILT_MAX;
  const rotateX = -clampedY * TILT_MAX;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  card.classList.add('tilting');

  // Position the glare at cursor location (as percentage)
  const glareX = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
  const glareY = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
  card.style.setProperty('--glare-x', `${glareX}%`);
  card.style.setProperty('--glare-y', `${glareY}%`);
});

tasksDOM.addEventListener('mouseleave', (e) => {
  // Reset all cards when cursor leaves the container
  const cards = tasksDOM.querySelectorAll('.single-task.tilting');
  cards.forEach(card => {
    card.style.transform = '';
    card.classList.remove('tilting');
  });
}, true);

// Also reset individual card when cursor leaves it
tasksDOM.addEventListener('mouseout', (e) => {
  const card = e.target.closest('.single-task');
  if (card && !e.relatedTarget?.closest('.single-task')) {
    card.style.transform = '';
    card.classList.remove('tilting');
  }
});