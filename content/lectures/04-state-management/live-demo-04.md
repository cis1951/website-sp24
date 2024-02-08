# Week 4 Tutorial: TaskManager App with SwiftUI

## Introduction

The TaskManager app is a simple demonstration of SwiftUI's capabilities for state management, including the use
of `@State`, `@Binding`, `@ObservedObject`, and `@EnvironmentObject`. This app allows users to add tasks, mark them
as completed, edit task details, and includes animations when reacting to state changes.

Let's get started!

## Step 1: Set Up the Project

1. **Create a New SwiftUI Project**: Open Xcode, select "Create a new Xcode project," choose the SwiftUI App template,
   and name your project "TaskManager."
2. **Project Structure Overview**:
    - The `ContentView.swift` file is where we'll spend most of our time, crafting the UI and logic of our app.
    - The `@main` App struct in `TaskManagerApp.swift`, which serves as the entry point of our SwiftUI application.

## Step 2: Design the TodoItem Model

Create a `TodoItem.swift` file, define a `TodoItem` struct with the following properties:

```swift
import Foundation

struct TodoItem: Identifiable {
    var id = UUID()
    var name: String
    var isCompleted: Bool
}
```

## Step 3: Add a Task List to ContentView

In this step, we'll create a view that lists all the tasks. We'll use `@State` to manage the array of tasks within this
view.

Modify the `ContentView` to include a `@State` variable that holds an array of `TodoItem`s and display them in a `List`.

 ```swift
import SwiftUI

struct ContentView: View {
    @State private var tasks = [TodoItem]()

    var body: some View {
        List(tasks) { task in
            Text(task.name)
        }
                .navigationBarTitle("TODOs")
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
 ```

## Step 4: Build a Form for User Input

Now, we'll add functionality to allow users to add new tasks to the list. We'll use a `TextField` for input and
a `Button` to submit the new task. This is a common combination that creates something similar to an HTML form for user
input.

Embed the existing `List` in a `VStack` and add a `TextField` and a `Button` above it to allow users to enter a new task
name and add it to the list.

 ```swift
 struct ContentView: View {
    @State private var tasks = [TodoItem]()
    @State private var newTaskName = "" // For capturing user input

    var body: some View {
        NavigationView {
            VStack {
                TextField("Enter new task", text: $newTaskName)
                        .padding()
                Button(action: {}) {
                    Text("Add Task")
                }
                        .padding()
                        .disabled(newTaskName.isEmpty)
                List(tasks) { task in
                    Text(task.name)
                }
                        .navigationBarTitle("TODOs")
            }
        }
    }
}
 ```

## Step 5: Create a New Task

Next, we implement the button functionality to add a new task upon form submission.

```swift
struct ContentView: View {
    // ...
    private func addNewTask() {
        let newTask = TodoItem(name: newTaskName, isCompleted: false)
        tasks.append(newTask)
        newTaskName = "" // Reset input field
    }

    // ...
}
 ```

```swift
Button(action: addNewTask)
```

## Step 6: Create a Custom View for Task Items

It is common to create a custom view for individual item views in a list, especially when the item view is complex. To
share data between the parent list and the children item views, we can use `@Binding`.

First, create a `TaskItemView.swift` file, and implement the item view:

 ```swift
import SwiftUI

struct TaskItemView: View {
    @Binding var task: TodoItem

    var body: some View {
        Text(task.name)
    }
}
```

Then, update the `List` in `ContentView` to use the custom item view:

```swift
List($tasks) { $task in
    TaskItemView(task: $task)
}
```

## Step 7: Mark a Task as Completed

To allow users to mark tasks as completed, we'll add a toggle next to each task in the list. Modify the `TaskItemView`
to include a `Toggle` for each task, bound to the task's `isCompleted` property.

```swift
struct TaskItemView: View {
    @Binding var task: TodoItem

    var body: some View {
        Toggle(isOn: $task.isCompleted) {
            Text(task.name)
        }
    }
}
```

## Step 8: Using @ObservedObject for Task Editing

When you have data that needs to be shared across multiple views or when your data model involves more complex
interactions, `@ObservedObject` becomes invaluable. It allows views to observe changes in an object that conforms to the
`ObservableObject` protocol, making it perfect for scenarios like editing task details.

First, let's define a `TaskViewModel` that will act as an `@ObservedObject`. This view model will manage the state of
the task being edited. Create a `TaskViewModel.swift` and implement the view model:

```swift
import Foundation

class TaskViewModel: ObservableObject {
    @Published var task: TodoItem
    @Published var draftName: String

    init(task: TodoItem) {
        self.task = task
        self.draftName = task.name
    }

    // Function to update the task's name
    func updateTaskName() {
        task.name = draftName
    }

    // Function to toggle the task's completion status
    func toggleCompletion() {
        task.isCompleted.toggle()
    }
}
```

Then, update `TaskItemView` to use `TaskViewModel` as an `@ObservedObject`. This allows `TaskItemView` to respond to
changes in the task's properties, such as its name or completion status.

```swift
import SwiftUI

struct TaskItemView: View {
    @ObservedObject var viewModel: TaskViewModel

    var body: some View {
        HStack {
            TextField("Task Name", text: $viewModel.task.name, onCommit: {
                viewModel.updateTaskName()
            })
            Toggle(isOn: $viewModel.task.isCompleted) {
                EmptyView()
            }
        }
    }
}
```

Finally, adjust the `List` in `ContentView` to create `TaskItemView` by initializing a `TaskViewModel` with the
corresponding `TodoItem`.

```swift
List($tasks) { $task in
    TaskItemView(viewModel: TaskViewModel(task: task))
}
```

## Step 9: Implementing Basic Animations and Transitions

We can use transitions to visually distinguish between active and completed tasks. For instance, when a task is marked
as completed, it could fade out or move to a different section of the UI.

```swift
struct TaskItemView: View {
    @ObservedObject var viewModel: TaskViewModel

    var body: some View {
        Toggle(isOn: $viewModel.task.isCompleted) {
            Text(viewModel.task.name)
        }
                .animation(.default, value: viewModel.task.isCompleted)
                .transition(.opacity)
    }
}
```

To make the addition of new tasks visually appealing, we can wrap the insertion logic in a `withAnimation` block.

```swift
private func addNewTask() {
    withAnimation {
        let newTask = TodoItem(name: newTaskName, isCompleted: false)
        tasks.append(newTask)
        newTaskName = "" // Reset input field
    }
}
```

## Step 10: Share the Task List Using @EnvironmentObject

`@EnvironmentObject` is ideal for sharing global data, such as user preferences or themes, across multiple views without
the need to pass them through each view explicitly.

First, define a `UserPreferences` class in a new `UserPrefrences.swift` file that includes user preferences like theme
settings. This class will be observed by various parts of our app to reflect changes in real-time.

```swift
import Foundation
import SwiftUI

class UserPreferences: ObservableObject {
    @Published var themeColor: Color = .blue // Default theme color

    // Add more preferences as needed
}
```

Now, modify `TaskManagerApp.swift` to create an instance of `UserPreferences` and provide it as an environment object to
the entire app. This way, all views within the app can access and react to changes in user preferences.

```swift
import SwiftUI

@main
struct TaskManagerApp: App {
    var userPreferences = UserPreferences()

    var body: some Scene {
        WindowGroup {
            ContentView()
                    .environmentObject(userPreferences)
        }
    }
}
```

Now, we can access it from `TaskItemView` using the `@EnvironmentObject` property wrapper:

```swift
import SwiftUI

struct TaskItemView: View {
    @EnvironmentObject var userPreferences: UserPreferences
    @ObservedObject var viewModel: TaskViewModel

    var body: some View {
        Toggle(isOn: $viewModel.task.isCompleted) {
            Text(viewModel.task.name)
                    .foregroundColor(userPreferences.themeColor) // Use theme color for text
        }
    }
}
```

## Conclusion

Great! You've just created your first full app from scratch. You can now call yourself an iOS developer. 😎
