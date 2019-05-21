# This is oddly familiar
<p class = "article-date">2018/10/6</p>

## FFI and JSON messaging

I recently started my Dissertation and began building a WebExtension from what was a single JavaScript file. This single JavaScript file is now a content script that my extension injects into the webpage. Unfortunately I don't want the UI the JavaScript file creates to be in the webpage; I want it in my sidebar.

I can't just send the UI code over to my sidebar and then insert it there for two reasons. One, the non UI code will then analyse my sidebar instead of the webpage when it tries to look at the `body`. Two, I can only send JSON.

My UI objects have functions that won't go through JSON. Even if I send them as strings they will lose their scope which they need to work.

Not that long ago I was writing code in [Rust and Lua](https://github.com/Skeletonxf/rust2d) going through FFI boundries all the time. The similarities between FFI through C and sending messages through JSON are quite extensive.

So having done a similar thing before I realised I could leave all the non UI code of my content script intact and drive it with JSON messages from my WebExtension's UI. Instead of moving the button that does something (very hard)<sup>1</sup> I can make a new button in my sidebar where I want it and have it send a message back to the code where that old button was defined (where the scope that I need is) to trigger the function the original button did and remove the original button.

*****

1 - Making a new button in my sidebar and removing the original isn't just moving it because the scope where the old was defined that it used to trigger actions didn't move with my button. It stayed in the content script. My new button can only interact over the interface I build around the JSON messaging and has no access to the data/functions the old one could call freely.
