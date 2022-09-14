class Dashboard{
    GOAL        = 8e9
    likes       = 0
    followers   = 1e6
    
    get progress(){
        return (100*this.followers/this.GOAL).toFixed(2)
    }

    update(){
        const updateText = (e,v) => e.textContent = v
        updateText(count, this.followers.toLocaleString(undefined, SHORT_NUMBER_FORMAT))
        updateText(countB, this.followers.toLocaleString(undefined, SHORT_NUMBER_FORMAT))
        updateText(progress,`${this.progress}%`)
        updateText(likes, this.likes.toLocaleString(undefined, SHORT_NUMBER_FORMAT))
    }

    
}