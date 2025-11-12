// DOM（HTMLの構造）が完全に読み込まれたら、中の処理を開始する
document.addEventListener('DOMContentLoaded', () => {

    // A. HTMLの部品をJavaScriptで操作できるように準備する
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    // B. タスクを追加する関数
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('タスクを入力してください。');
            return;
        }

        const listItem = createTaskElement(taskText, false);
        taskList.prepend(listItem);
        
        saveTasks();

        // ★リクエストされた機能：入力欄を空にする
        taskInput.value = '';
        taskInput.focus();
    }

    // C. タスク要素を生成する関数
    function createTaskElement(text, isCompleted) {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = text;
        
        // ★リクエストされた機能：チェックボックスの変更を監視
        checkbox.addEventListener('change', () => {
            // 'completed'クラスを付けたり外したりする
            listItem.classList.toggle('completed', checkbox.checked);
            // CSSでスタイルを適用するため、span要素にも'completed'クラスをトグルする
            taskTextSpan.classList.toggle('completed', checkbox.checked);
            saveTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
            saveTasks();
        });

        // ページ読み込み時、完了状態であればクラスを追加する
        if (isCompleted) {
            listItem.classList.add('completed');
            taskTextSpan.classList.add('completed');
        }

        listItem.appendChild(checkbox);
        listItem.appendChild(taskTextSpan);
        listItem.appendChild(deleteButton);
        
        return listItem;
    }

    // D. タスクをlocalStorageに保存する関数
    function saveTasks() {
        // ★修正点：空の配列を正しく初期化
        const tasks = []; 
        document.querySelectorAll('.task-item').forEach(item => {
            const text = item.querySelector('.task-text').textContent;
            const isCompleted = item.classList.contains('completed');
            tasks.push({ text, isCompleted }); // 配列にオブジェクトを追加
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // E. localStorageからタスクを読み込む関数
    function loadTasks() {
        // ★修正点：データがない場合は空の配列を使用
        const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
        tasks.forEach(task => { // 配列のforEachを使用
            const listItem = createTaskElement(task.text, task.isCompleted);
            taskList.appendChild(listItem);
        });
    }

    // F. イベントリスナーを設定する
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // G. 初期化処理：ページ読み込み時に保存されたタスクを読み込む
    loadTasks();
});