function menu()
{
    let button_sound = new Audio("sound/pew.mp3")
    let menu_page = document.getElementById("menu")
    menu_page.style.display = "block"
    let buttons = document.getElementsByClassName("b")
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener("mouseenter", (e) => {
            button_sound.play()
        })
        buttons[i].addEventListener("mouseleave", (e) => {
            button_sound.pause()
            button_sound.currentTime = 0
        })
    }
}

let buttons = document.getElementsByClassName("b")

buttons[0].onclick = () => {
    game()
}