class Post{
    postElem
    likesElem
    likesCounter = 0
    followersCounter = 0
    constructor(type, topic){
        this.type = type
        this.topic = topic 
        this.postElem   = document.createElement('div')
        activePosts.insertBefore(this.postElem, activePosts.firstChild)
        this.render()
    }

    render(){
        this.postElem.innerHTML = `
        <div class="post">
            <span>Your ${this.type} about ${this.topic}</span>
            <section class="action-bar">
                <span>♡${shortNumber(this.likesCounter)}</span>
                <span>☺${shortNumber(this.followersCounter)}</span>
            </section>
        </div>
        `
    }

    update(likes, followers){
        this.likesCounter += likes
        this.followersCounter += followers
        this.render()
    }

    deactivate(){
        inactivePosts.insertBefore(this.postElem, inactivePosts.firstChild)
    }


}