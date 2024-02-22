# Bubble Game!
This README contains the instructions and code for **Lecture 6: Custom Views & Event Handling**.

Here, we're going to build a game! In this game, bubbles will pop up on the screen, and based on their appearence you will have to perform different gestures to clear them. You can restart the game when you're done, and also add other neat features/interesting looking bubbles.

Here's a walkthrough of the steps we cover in lecture:

## Step 0: Create a new XCode project. You can call it BubbleGame if you wish (store it in the `apps` directory).

## Step 1: Lets now first start by defining a model for our bubbles. We will probably want to store their size, position, color, and maybe some other properties later. So for now, lets make a file called `BubbleModel.swift` with the following struct. Note that we want it to conform to `Identifiable` to make our lives easier in the future, and all of the other properties are declared with `var` in case we want to change them later. Don't worry too much about the `CGFloat` type, just think of it as a normal float (it changes its precision based on the device, but you don't need to worry about this). This is the data type that many views and modifiers dealing with coordinates in SwiftUI use.

```swift
struct Bubble: Identifiable {
    let id = UUID()
    var color: Color
    var x: CGFloat
    var y: CGFloat
    var size: CGFloat
}
``` 

## Step 2: Now lets create the main view. In `ContentView`, let's start by adding a button to start the game. We'll also want to add a `ZStack` to put the bubbles on below the button, and let's give the `ZStack` an infinite maxWidth and maxHeight so it takes up the whole screen. So it will start something like this:

```swift
struct ContentView: View {
    var body: some View {
        ZStack {
            Button(action: {}) {
                Text("Start Game")
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
```

Now let's customize the button a little bit, using what you learned about SwiftUI shapes! Let's add a `Capsule` as the background for the button, and give it some styling so it looks nicer. We will fill this button with a blue background.

```swift
struct ContentView: View {
    var body: some View {
        ZStack {
            Button(action: {}) {
                Text("Start Game")
                    .font(.title)
                    .foregroundColor(Color.white)
                    .padding()
                    .frame(maxWidth: 200, alignment: .center)
                    .background(
                        Capsule()
                            .fill(.blue)
                    )
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
```

## Step 3: Now lets add the logic to actually start the game. To do this, we will want 2 things, first a variable to store whether or not the game has started, and also a variable to store the list of bubbles. Therefore we will add these two variables to the top of `ContentView`. They should also be `@State` properties since this view "owns" them and needs to update its UI when they change. Now lets also only show the button to start the game if it hasn't been started yet, like so:

```swift
struct ContentView: View {
    @State private var bubbles: [Bubble] = []
    @State private var gameStarted = false

    var body: some View {
        ZStack {
            if !gameStarted {
                Button(action: {}) {
                    Text("Start Game")
                        .font(.title)
                        .foregroundColor(Color.white)
                        .padding()
                        .frame(maxWidth: 200, alignment: .center)
                        .background(
                            Capsule()
                                .fill(.blue)
                        )
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
```

Now when this button is clicked, we want to generate the bubbles, and then start the game. Lets make a function called `startGame` to handle this for us, so it will set `gameStarted = true` and for now, generate 10 bubbles randomly. Lets make the size random from 20 to 50, and have them appear anywhere on the screen. For now, you can use `UIScreen.main.bounds.width` to get the width of the screen, but we will change this later. Note that (0, 0) is in the TOP LEFT of the screen, and positive y goes downwards.

Thus the function looks like:

```swift
private func startGame() {
    for _ in 1...10 {
        let size = CGFloat.random(in: 20...50)
        let x = CGFloat.random(in: 0...UIScreen.main.bounds.width)
        let y = CGFloat.random(in: 0...UIScreen.main.bounds.height)
        let bubble = Bubble(color: Color.blue, x, y: y, size: size)
        bubbles.append(bubble)
    }

    gameStarted = true
}
```

Now we actually need to call this function when the button is clicked. We can do this by adding the `startGame` function to the `Button`'s `action` parameter. Additionally, lets show the bubbles on the screen. So for each bubble, lets draw a `Circle()` with fill color of the button's color, and set its position, like so:

```swift
var body: some View {
    ZStack {
        ForEach(bubbles) { bubble in
            Circle()
                .fill(bubble.color)
                .frame(width: bubble.size, height: bubble.size)
                .position(x: bubble.x, y: bubble.y)
        }
        
        if !gameStarted {
            Button(action: {
                startGame()
            }) {
                Text("Start Game")
                    .font(.title)
                    .foregroundColor(Color.white)
                    .padding()
                    .frame(maxWidth: 200, alignment: .center)
                    .background(
                        Capsule()
                            .fill(.blue)
                    )
            }
        }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
}
```

## Step 4: Now we actually want to remove the bubbles when they are clicked, or on some other gesture. Lets start with a simple `onTapGesture`. Lets add the following function to remove a bubble, and reset the game if there's none left:

```swift
private func removeBubble(_ bubble: Bubble) {
    bubbles.removeAll { $0.id == bubble.id }
    
    if bubbles.isEmpty {
        gameStarted = false
    }
}
```

Now we will actually need to call this function. Add an `onTapGesture` to the bubble's `Circle()` that calls this function:

```swift
ForEach(bubbles) { bubble in
    Circle()
        .fill(bubble.color)
        .frame(width: bubble.size, height: bubble.size)
        .position(x: bubble.x, y: bubble.y)
        .onTapGesture {
            removeBubble(bubble)
        }
}
```

## Step 5: Take a break and play your game! Congrats, the very basic functionality has been implemented. Try running it and seeing how it feels!

## Step 6: Now we will improve it. You might have noticed a few issues while playing the game. The first is that bubbles can spawn too close to the screen's edge, making them impossible to tap. Additionaly, if we ever want to further customize the bubble's view, we probably should refactor this out to a seperate view as it gets more complex.

Let's do this second one first. We will create a new file called `BubbleView.swift` and move the `Circle` drawing code into a new `BubbleView` struct. This struct will take a `Bubble` as a parameter, and draw the circle with the bubble's properties. You can use something like this:

```swift
struct BubbleView: View {
    var bubble: Bubble
    
    var body: some View {
        Circle()
            .fill(bubble.color)
            .frame(width: bubble.size, height: bubble.size)
            .position(x: bubble.x, y: bubble.y)
    }
}

#Preview {
    BubbleView(bubble: Bubble(color: Color.blue, x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height / 2, size: 50))
}
```

Now in `ContentView`, we can replace the `Circle` with the `BubbleView` like so:

```swift
ForEach(bubbles) { bubble in
    BubbleView(bubble: bubble)
        .onTapGesture {
            removeBubble(bubble)
        }
}
```

## Step 7: Now lets fix the issue mentioned earlier about bubbles spawning too close to the screen border. We could fix this by just subtracting some padding from the border of the screen (e.g. `UIScreen.main.bounds.width - 50`), but this is not very scalable. Instead, we will create a View that represents our entire game board, and then use GeometryReader to get the size of the view and use that to spawn the bubbles. To do this, lets do a decent amount of refactoring. First, create a new file called `GameAreaView.swift`. This file will contain a new struct called `GameAreaView` that will be a `View` and will represent the entire playable game board. Lets move the definition of the bubbles array inside this struct, since we only care about that array here. Additionally lets move the `startGame` and `removeBubble` logic inside this view so we have something like:

```swift
struct GameAreaView: View {
    @State private var bubbles: [Bubble] = []

    var body: some View {
        ZStack {
            ForEach(bubbles) { bubble in
                BubbleView(bubble: bubble)
                    .onTapGesture {
                        removeBubble(bubble)
                    }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private func startGame() {
        for _ in 1...10 {
            let size = CGFloat.random(in: 20...50)
            let x = CGFloat.random(in: 0...UIScreen.main.bounds.width)
            let y = CGFloat.random(in: 0...UIScreen.main.bounds.height)
            let bubble = Bubble(color: Color.blue, x: x, y: y, size: size)
            bubbles.append(bubble)
        }

        gameStarted = true
    }

    private func removeBubble(_ bubble: Bubble) {
        bubbles.removeAll { $0.id == bubble.id }
        
        if bubbles.isEmpty {
            gameStarted = false
        }
    }
}
```

Now notice that we still probably want the `@State var gameStarted` defined in the `ContentView`, so lets leave it there, but we will need access to it in this `GameAreaView`. Also, since we modify its value in the `GameAreaView`, we will need it to be a binding variable. Thus we can add

```swift
@Binding var gameStarted: Bool
```

to the top of `GameAreaView`. Additionally, whenever this variable is set to true, we want to start the game, so we can add:

```swift
ZStack {
    ForEach(bubbles) { bubble in
        BubbleView(bubble: bubble)
            .onTapGesture {
                removeBubble(bubble)
            }
    }
}
.frame(maxWidth: .infinity, maxHeight: .infinity)
.onChange(of: gameStarted) {
    if gameStarted {
        startGame()
    }
}
```

Overall, this file show now look something like:

```swift
struct GameAreaView: View {
    @Binding var gameStarted: Bool
    @State private var bubbles: [Bubble] = []

    var body: some View {
        ZStack {
            ForEach(bubbles) { bubble in
                BubbleView(bubble: bubble)
                    .onTapGesture {
                        removeBubble(bubble)
                    }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .onChange(of: gameStarted) {
            if gameStarted {
                startGame()
            }
        }
    }

    private func startGame() {
        for _ in 1...10 {
            let size = CGFloat.random(in: 20...50)
            let x = CGFloat.random(in: 0...UIScreen.main.bounds.width)
            let y = CGFloat.random(in: 0...UIScreen.main.bounds.height)
            let bubble = Bubble(color: Color.blue, x: x, y: y, size: size)
            bubbles.append(bubble)
        }

        gameStarted = true
    }

    private func removeBubble(_ bubble: Bubble) {
        bubbles.removeAll { $0.id == bubble.id }
        
        if bubbles.isEmpty {
            gameStarted = false
        }
    }
}

struct GameAreaView_Previews: PreviewProvider {
    @State static var gameStarted = true
    static var previews: some View {
        GameAreaView(gameStarted: $gameStarted)
    }
}
```

The different preview syntax at the bottom is just getting the preview to work since it needs a binding parameter. We should also now fix the origial `ContentView` so it is just

```swift
struct ContentView: View {
    @State private var gameStarted = false

    var body: some View {
        ZStack {
            GameAreaView(gameStarted: $gameStarted)
            
            if !gameStarted {
                Button(action: {
                    gameStarted = true
                }) {
                    Text("Start Game")
                        .font(.title)
                        .foregroundColor(Color.white)
                        .padding()
                        .frame(maxWidth: 200, alignment: .center)
                        .background(
                            Capsule()
                                .fill(.blue)
                        )
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}
```

## Step 8: Finally we can use the `GeometryReader` to get the size of the view and use that to spawn the bubbles. In `GameAreaView`, wrap the `ZStack` with `GeometryReader { proxy in`. Now lets pass in the size of the view into the `startGame` function so that we know where to spawn the bubbles. Modify `startGame` so it takes in a `size: CGSize`. The type `CGSize` is effectively an ordered pair of `CGFloats`, but it has some other properties if you want to use those. Now lets modify `startGame` to be

```swift
private func startGame(size: CGSize) {
    bubbles.removeAll()
    
    for _ in 1...10 {
        let bubbleSize = CGFloat.random(in: 20...50)
        let x = CGFloat.random(in: bubbleSize...size.width - bubbleSize)
        let y = CGFloat.random(in: bubbleSize...size.height - bubbleSize)
        let bubble = Bubble(color: Color.blue, x: x, y: y, size: bubbleSize)
        bubbles.append(bubble)
    }
}
```

Notice now we are randomly making the `x` and `y` positions based on the size of the view, so and we are accounting for the bubble's width, so we don't need to worry about it being too close to the border now. Finally, change where `startGame` is called to pass in the proxy's size, like so: `startGame(size: proxy.size)`.

You should now be able to play the game without worrying about the screen bounds!

## Step 9: Now lets add different types of bubbles. When creating them, randomly decide between two types, swipe bubbles and tap bubbles. For tap bubbles, randomly generate a number from 1 to 3, and this will be the number of total times they have to be tapped. For swipe bubbles, randomly generate an angle from 0 to 360, which represents the direction they have to swipe the bubbles. Modify the bubble struct like so to support this:

```swift
struct Bubble: Identifiable {
    enum BubbleType: CaseIterable {
        case swipe
        case tap
    }
    
    let id = UUID()
    var color: Color
    var x: CGFloat
    var y: CGFloat
    var size: CGFloat
    var type: BubbleType
    var swipeAngle: Angle?
    var tapCount: Int?
}
```

The `CaseIterable` protocal will just let us randomly select one of those cases when generating a bubble. Also change the start game function to generate these values randomly:

```swift
private func startGame(size: CGSize) {
    bubbles.removeAll()
    
    for _ in 1...10 {
        let bubbleSize = CGFloat.random(in: 20...50)
        let x = CGFloat.random(in: bubbleSize...size.width - bubbleSize)
        let y = CGFloat.random(in: bubbleSize...size.height - bubbleSize)
        let bubbleType = Bubble.BubbleType.allCases.randomElement()!
        
        switch bubbleType {
        case .swipe:
            let swipeAngle = Angle(degrees: Double.random(in: -180...180))
            bubbles.append(Bubble(color: Color.blue, x: x, y: y, size: bubbleSize, type: bubbleType, swipeAngle: swipeAngle))
        case .tap:
            let tapCount = Int.random(in: 1...3)
            bubbles.append(Bubble(color: Color.blue, x: x, y: y, size: bubbleSize, type: bubbleType, tapCount: tapCount))
        }
    }
}
```

## Step 10: Now lets change the BubbleView based on the type. If it is type `tap`, lets just add the number to the center. If it's type `swipe`, lets add an arrow in the corresponding direction, like so:

```swift
struct BubbleView: View {
    var bubble: Bubble
    
    var body: some View {
        ZStack {
            Circle()
                .fill(bubble.color)
                .strokeBorder(Color.black)
            
            if bubble.type == .tap {
                Text("\(bubble.tapCount ?? 1)")
            } else {
                Image(systemName: "arrow.right")
                    .rotationEffect(bubble.swipeAngle ?? Angle(degrees: 0))
            }
        }
        .frame(width: bubble.size, height: bubble.size)
        .position(x: bubble.x, y: bubble.y)
    }
}

#Preview {
    BubbleView(bubble: Bubble(color: Color.blue, x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height / 2, size: 50, type: .tap, tapCount: 2))
}
```

While we're here, modify the background so it's something cool! Maybe add different Strokes to the border, maybe make it an image, do something fun!

## Step 11: Finally we're ready to add the gesture recognition! Lets first modify `removeBubble` and rename it to `tryRemoveBubble`, and have it take in two optional parameters `taps` and `angle`. This function will be called by the gesture handlers later, one will pass in the number of taps, and the other the angle of the swipe. Now if the bubble has type `tap`, we should decrement the total number of taps left, and if it reaches 0, remove it. If the bubble has type `swipe`, we should check that the input angle is within 30 degrees of the bubbles required angle like so:

```swift
private func tryRemoveBubble(_ bubble: Bubble, taps: Int = 0, angle: Angle = Angle(degrees: 0)) {
    if bubble.type == .tap {
        if let index = bubbles.firstIndex(where: { $0.id == bubble.id }) {
            bubbles[index].tapCount? -= taps
            if bubbles[index].tapCount == 0 {
                bubbles.remove(at: index)
            }
        }
    } else if let bubbleAngle = bubble.swipeAngle {
        // Check if angle and bubble's angle are within 30 degrees
        let bubbleAngle = bubbleAngle.degrees.truncatingRemainder(dividingBy: 360)
        let swipeAngle = angle.degrees.truncatingRemainder(dividingBy: 360)
        let angleDiff = abs(bubbleAngle - swipeAngle)

        if angleDiff <= 30 || angleDiff >= 330 {
            bubbles.removeAll { $0.id == bubble.id }
        }
    }
    
    if bubbles.isEmpty {
        gameStarted = false
    }
}
```

Finally, we should add the calls to this function. To the end of the `BubbleView` in `GameAreaView`, add a `.onTapGesture` modifier that calls `tryRemoveBubble(bubble, taps: 1)`. Also add a `.gesture` which will take in a `DragGesture` like so:

```swift
BubbleView(bubble: bubble)
    .onTapGesture {
        tryRemoveBubble(bubble, taps: 1)
    }
    .gesture(DragGesture(minimumDistance: 3.0, coordinateSpace: .local)
        .onEnded { value in
            let angle = atan2(value.translation.height, value.translation.width)
            tryRemoveBubble(bubble, angle: Angle(radians: angle))
        }
    )
```

Note the minimumDistance, which is the smallest distance for that gesture to trigger the activation. Then, once this gesture ends, we take the value's translation to calculate the angle of the drag. Then this angle is passed into the `tryRemoveBubble` function.

## Celebrate! You're now done with a cool game! If you have extra time and are still interested in doing more, try adding a score counter, sound effects, or maybe a timer to have the player race!
