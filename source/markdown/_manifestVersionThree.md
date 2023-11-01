# Manifest Version 3
<p class = "article-date">2023/11/1</p>

When I started learning how to develop Android apps something that stood out to me was the lack of persistence in the engine code. When the app for whatever reason restarted its engine (easily reproduced with the *don't keep activities* setting and yet rare enough it's the kind of thing you might never see in development), all the state held in memory would be lost - except for the navigation. The back stack would have been saved and restored, returning the user to the same position in the app that they were.

In a well designed app, this is desirable, you would have saved anything that needed saving to disk or to the back stack itself, and thus losing the engine merely causes the engine to be reconstructed with the user none the wiser. It's also good for the user to an extent, as apps can be killed yet still remain when memory is low.

However, this was still a paradigm shift for me because I was used to building things for desktop or the web where the code that started running would keep running until the user actually exited the application or tab, or the web server shut down. When you have a persistent background process that won't die unexpectedly you can be a lot more free with how you pass or retain state. Passing a function to a function, perhaps a callback to be ran later asynchronously would just work fine. In an Android application you are going to have issues trying to pass a function through navigation layers because a function is not data. Something as 'simple' as a [DialogFragment](https://developer.android.com/reference/androidx/fragment/app/DialogFragment.html) can misused with constructors that take callbacks as arguments - and it will seem to work fine until the system recreates the fragment using the default constructor. Of course there are many alternatives to use on Android that avoid this, if you're developing a Compose app you can instead [pass values back to the prior screen](https://composedestinations.rafaelcosta.xyz/navigation/backresult) and *that* screen can have the function that is ran later asynchronously.

Why are I talking about Android when the title is Manifest Version 3 you ask?

Manifest Version 3 is this same paradigm shift. You can no longer rely on the background page of the browser add-on running at all times - the browser will reload it in response to various triggers such as user interaction and once it is idle it gets unloaded again. This again necessitated saving state to 'disk' for me to migrate my first add-on over. What was previously guaranteed to be in memory for one part of the add-on to fetch from another was no longer.

However, unlike Android, Firefox Developer Edition has a really quick and fast hot reload. Because the background page is no longer persisted, and because a well designed add-on doesn't assume it is, reloading the new version of the code instead of the same version more or less just works too. The developer flow can be test add-on -> hit bug -> fix the code -> reload add-on -> retest without having to get back into that state. This is really useful for developer productivity as it shortens the feedback loop a lot.

Because of this shift however, the more state a persistent manifest version 2 add-on relies upon the greater the effort of migrating to manifest version 3 will be. At least you can migrate to a non-persistent manifest version 2 add-on first 🙂.