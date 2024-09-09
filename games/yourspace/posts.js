
typeText.onclick        = () => currentPostType.textContent = 'text'
typePhoto.onclick       = () => currentPostType.textContent = 'photo'
typeVideo.onclick       = () => currentPostType.textContent = 'video'
typeSong.onclick        = () => currentPostType.textContent = 'song'
typeLink.onclick        = () => currentPostType.textContent = 'link'
typeStory.onclick       = () => currentPostType.textContent = 'story'

contentAnimal.onclick   = () => currentPostContent.textContent = 'animals'
contentFood.onclick     = () => currentPostContent.textContent = 'food'
contentNews.onclick     = () => currentPostContent.textContent = 'news'
contentMemory.onclick   = () => currentPostContent.textContent = 'memories'
contentOpinion.onclick  = () => currentPostContent.textContent = 'an opinion'
contentTravel.onclick   = () => currentPostContent.textContent = 'a place'
contentDance.onclick    = () => currentPostContent.textContent = 'a dance'

createPost.onclick = () => {
    const type = currentPostType.textContent
    const content = currentPostContent.textContent
    
    const post = new Post(type, content)
    // const trendBoost = TRENDS_CURRENT
    //                     .map( i => TRENDING_TOPICS[i])
    //                     .filter( tt => tt['affects'].includes(`${type}/${content}` ))
    //                     .map(tt => tt['boost'])
    //                     .reduce( (a,b) => a*b, 1)
    //                     ?? 1

    const currentTrending = TRENDS_CURRENT.map( i => TRENDING_TOPICS[i])
    const trendsAffectingPost = currentTrending.filter( tt => tt['affects'].includes(`${type}/${content}` ))
    const trendBoost = trendsAffectingPost.map(tt => tt['boost']).reduce( (a,b) => a*b, 1) ?? 1


    const reach = dashboard.followers * (1+P_SHARE[type][content]) * trendBoost
    const newLikes = Math.floor(reach * P_LIKES[type][content])
    const newFollowers = Math.floor((reach - dashboard.followers) * P_FOLLOW)
    
    distribute(newLikes,newFollowers,14, (likes,followers) => post.update(likes, followers), ()=> post.deactivate())
    
    toggleScreen(screenFeed,screenPost)
}
