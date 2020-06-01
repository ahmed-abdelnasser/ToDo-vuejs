var filters = {
    all: function (todods) {
        return todods;
    },
    active: function (todods) {
        return todods.filter(function (todo) {
            return !todo.complete;
        });
    },
    completes: function (todos) {
        return todos.filter(function (to) {
            return to.complete;
        });
    }
}

var todos_storage = {
    getAll: function () {
        var todos = JSON.parse(localStorage.getItem('todos') || '[]');
        return todos;
    },
    save: function (todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }


}


new Vue({
    el: '.todoapp',
    data: {
        newTodo: '',
        visability: 'all',
        editingTodo: null,
        oldValue: null,
        todos: todos_storage.getAll(),
        // todos: [
        //     { title: 'test 1', complete: true },
        //     { title: 'test 2', complete: false },
        // ],
    },
    computed: {
        filterTodo: function () {
            return filters[this.visability](this.todos);
        },
        remaningTodos: function () {
            return filters.active(this.todos).length;
        },
        remaningText: function () {
            if (this.remaningTodos > 1) {
                return 'items';
            }
            return 'item';
        },
        allDone: {
            get: function () {
                return this.remaningTodos === 0;
            },
            set: function (value) {
                this.todos.forEach(function (todo) {
                    todo.complete = value;
                });
            }
        }
    },
    methods: {
        deleteTask: function (task) {
            // this.todos.splice(this.todos.indexOf(task),1);
            this.todos.splice(task, 1);
        },
        addTodo: function () {
            if (this.newTodo == '')
                return;

            this.todos.push({
                'title': this.newTodo,
                'complete': false,
            });
            this.newTodo = '';
        },
        removeCompleted: function () {
            this.todos = filters.active(this.todos);
        },
        editTodo: function (todo) {
            this.editingTodo = todo;
            this.oldValue = todo.title;
        },
        doneEdit: function () {
            if (this.editingTodo.title === '')
                this.deleteTask(this.todos.indexOf(this.editingTodo));

            this.editingTodo = null;
        },
        cancelEdit: function () {
            this.editingTodo.title = this.oldValue;
            this.editingTodo = null;

        }
    },
    watch: {
        todos: {
            handler: function (todos) {
                todos_storage.save(todos);
            },
            deep: true,
        },
    },


});