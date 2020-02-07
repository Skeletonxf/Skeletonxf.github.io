# Multiple WiFi sources on KDE Plasma
<p class = "article-date">2019/01/24</p>

I had often wondered why I couldn't connect to ethernet and WiFi at once to improve my bandwidth. My desktop had both a WiFi chip and an ethernet socket so I never quite understood why both weren't an option. Fast forward to this week at the time of writing and my WiFi setup for my desktop was no longer ethernet but by WiFi with very poor signal and no direct line of sight to the router. I improved my signal by moving my desktop closer to my door / router but this improvement seemed to no longer be enough. The WiFi was regularly cutting out on me and becoming very problematic. I figured it was at least partially the linux Broadcom WiFi drivers because while the signal was still poor when booting Windows 7 it didn't cut out on me.

I therefore ordered a "plug and play" USB WiFi network adapter which uses an AR9271L Atheros chip. I 'knew' this should work easily because [wikipedia shows it as integrated into the mainline kernel and doesn't require non free firmware](https://en.wikipedia.org/wiki/Comparison_of_open-source_wireless_drivers), plus it is quite old so any bugs should be fixed.

KDE Plasma didn't give me any visual indicators that the WiFi network adapter was detected. I didn't get an entry in the drivers tab either.

![Driver management software, Broadcom WiFi adapter and graphics card present, new USB WiFi adapter not present](./images/no-additional-drivers.png)

After unsuccessfully testing many different terminal commands and learning very little I tried connecting the USB WiFi network adapter to my laptop, which still runs Ubuntu Unity. To my amazement it not only detected and displayed the USB WiFi adapter in the system settings but also let me connect to my home WiFi with both simultaneously. This confirmed that the USB WiFi adapter did work and was plug and play so I then tested my desktop using Windows 7 with the network adapter. Windows 7 also let me setup two simulatneous connections.

This made me fairly confident that KDE Plasma was the problem and not my WiFi adapter, so I tried installing Ubuntu Unity onto my desktop. I would like to caution any readers at this point that installing multiple desktop environments on the same system is **asking** for problems. Unsurprisingly, I had a lot of weird themes and icon sets selected on Unity when I logged into it, but I also finally had the network adapter showing up in the WiFi menus and was able to setup the two simulatneous connections.

<figure>
![Unity 7 WiFi selection allowing both WiFi chips to connect to the same network](./images/unity-wifi-selection.png)
    <figcaption>Unity 7 WiFi selection allowing both WiFi chips to connect to the same network. Using Arc rather than Unity's default Adawita because the Adawita theme had weird 1 pixel white borders on windows. Not pictured: KDE's Latte dock also present alongside Unity's dock. I did say installing a second desktop environment is asking for problems</figcaption>
<figure>

The graphical mismatches and theming problems persisted so I gave up on Unity and decided to try Plasma again and hope that the WiFi configuration persisted.

![Multiple simulatneous WiFi connections on KDE Plasma](./images/two-connections.png)

It turns out that KDE Plasma detected my USB network adapter all along.

![Restrict to device setting available on KDE Plasma WiFi connection settings](./images/restrict-to-device.png)

You have to create a new connection for the same network and then restrict each one to the device that you want.

My Broadcom WiFi connection continues to cut out but my Atheros WiFi connection doesn't, and when both are working I get even better bandwidth. I still don't know why this was never an option for ethernet + WiFi but I'm glad multiple WiFi sources works.
