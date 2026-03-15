const taskIDDOM = document.querySelector('.task-edit-id');
const taskNameDOM = document.querySelector('.task-edit-name');
const taskCompletedDOM = document.querySelector('.task-edit-completed');
const editFormDOM = document.querySelector('.single-task-form');
const editBtnDOM = document.querySelector('.task-edit-btn');
const formAlertDOM = document.querySelector('.form-alert');

const params = window.location.search;
const id = new URLSearchParams(params).get('id');
let tempName;
let tempCompleted;

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`);

    const { _id: taskID, completed, name } = task;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    tempName = name;
    taskCompletedDOM.checked = completed;
    tempCompleted = completed;
  } catch (error) {
    console.error('Error loading task:', error.response?.data || error.message);
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent =
      error.response?.data?.message || 'Unable to load task. Please try again.';
    formAlertDOM.classList.add('text-danger');
  }
};

showTask();

editFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  editBtnDOM.textContent = 'Loading...';

  const taskName = taskNameDOM.value.trim();
  const taskCompleted = taskCompletedDOM.checked;

  if (!taskName) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Task name cannot be empty';
    formAlertDOM.classList.add('text-danger');
    formAlertDOM.classList.remove('text-success', 'text-neutral');
    editBtnDOM.textContent = 'Edit';
    return;
  }

  // === DATA INTEGRITY VERIFICATION ===
  // Deep comparison against original stored state
  if (taskName === tempName && taskCompleted === tempCompleted) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'No changes detected. Task is already up to date.';
    formAlertDOM.classList.remove('text-success', 'text-danger');
    formAlertDOM.classList.add('text-neutral');
    editBtnDOM.textContent = 'Edit';
    
    setTimeout(() => {
      formAlertDOM.style.display = 'none';
      formAlertDOM.classList.remove('text-neutral');
    }, 3000);
    return;
  }

  try {
    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskName,
      completed: taskCompleted,
    });

    const { _id: taskID, completed, name } = task;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    tempName = name;
    taskCompletedDOM.checked = completed;
    tempCompleted = completed;

    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Success, edited task';
    formAlertDOM.classList.add('text-success');
    formAlertDOM.classList.remove('text-danger', 'text-neutral');
  } catch (error) {
    console.error('Error updating task:', error.response?.data || error.message);
    taskNameDOM.value = tempName;
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent =
      error.response?.data?.message || 'Error, please try again';
    formAlertDOM.classList.add('text-danger');
    formAlertDOM.classList.remove('text-success', 'text-neutral');
  }

    editBtnDOM.textContent = 'Edit';

    // === NEON RECOIL BLOOM ===
    // If the task was just marked as completed, trigger the bloom reward
    if (completed) {
      editFormDOM.classList.remove('bloom-active', 'bloom-locked');
      // Force reflow to restart animation
      void editFormDOM.offsetWidth;
      editFormDOM.classList.add('bloom-active');
      editFormDOM.addEventListener('animationend', () => {
        editFormDOM.classList.remove('bloom-active');
        editFormDOM.classList.add('bloom-locked');
      }, { once: true });
    } else {
      // Remove green glow if task is unchecked
      editFormDOM.classList.remove('bloom-active', 'bloom-locked');
    }

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success', 'text-danger', 'text-neutral');
  }, 3000);
}); 
