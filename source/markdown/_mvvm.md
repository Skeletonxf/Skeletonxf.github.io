# Model-View-ViewModel what?
<p class = "article-date">2019/12/17</p>

I still vaguely remember being introduced to the Model-View-Controller pattern a few years ago in  a web development university module. At the time it seemed like MVC was *the* solution so I was very confused when two years later in my app development module MVC was criticised and MVVM was promoted.

After some thinking It makes sense to me that there is this divide. In traditional web development your server serves webpages to the client that interact with the Controller by requesting other views. There it makes sense for the Controller to control the View. It would be quite a challenge making an HTML page change itself when you click a URL instead of loading the new webpage!<sup>1</sup> On Android the interface between the View and the thing that interfaces with the Model can be a lot richer with lots of communication in both directions. Furthermore, Android will kill views that have been closed even if the thing that interfaces with the View and Model is still running, even if it still holds references to the now killed View! This makes it a lot easier to use a ViewModel instead which exposes state and data to the View but doesn't do any controlling.

However I still have no idea why this middle layer is called a ViewModel. It's not a View and it's not a Model. The ViewModel doesn't do any controlling of the View like in MVC, so a synonym of Controller also wouldn't fit, but it does expose things to the View that let the views control themselves. Hence I propose what I think is a better name for this pattern:

Model-View-Inverted Controller

I think Inverted Controller captures the idea of letting something else observe what it needs to do much better.

Now I realise that when I was building a website in React last year for a group coursework that what we were creating was straying away from MVC and becoming a bit like MVVM. Because the website had to work offline our webpages served by the server were more like templates and we were observing the actual state and data of the application through additional message passes using web sockets and get and post requests.

From a brief search I notice other Javascript UI frameworks are probably similar in this respect. It seems like Vue and Angular support two way data binding, which is a key component in writing Android apps using MVVM without lots of boilerplate.

Perhaps an explicit ViewModel won't ever fit into the dichotomy of the client/server world of web development but for me MVVM doesn't seem so different to web development anymore.

*****

1 -  am aware that this is almost exactly what our website that worked offline ended up doing. If it didn't have to work offline it would have probably taken us half as much time to develop.
