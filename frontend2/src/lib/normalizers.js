export function toArray(data) {
  if (Array.isArray(data)) {
    return data
  }

  return data ? [data] : []
}

export function getProfileMeta(profile) {
  return {
    key: profile.id ?? profile.pk ?? JSON.stringify(profile),
    username: profile.username ?? profile.user?.username ?? 'Unknown user',
    bio: profile.bio ?? profile.about ?? '',
    isPrivate: Boolean(profile.is_private),
    image: profile.profile_image || '',
  }
}

export function getPostMeta(post) {
  return {
    key: post.id ?? post.pk ?? JSON.stringify(post),
    id: post.id ?? post.pk,
    author:
      post.user_username ??
      post.author?.username ??
      post.user?.username ??
      post.author ??
      'Unknown author',
    text: post.caption ?? post.content ?? post.text ?? post.body ?? '',
    created: post.created_at ?? post.created ?? post.timestamp,
    isReel: Boolean(post.is_reel),
  }
}

export function getMessageMeta(message) {
  return {
    key: message.id ?? message.pk ?? JSON.stringify(message),
    sender:
      message.sender?.username ??
      message.sender_username ??
      message.sender ??
      'Unknown sender',
    body: message.text ?? message.body ?? message.content ?? '',
    created: message.created_at ?? message.created ?? message.timestamp,
    conversation: message.conversation,
  }
}
