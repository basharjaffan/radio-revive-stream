export const topicMatches = (subscription: string, topic: string) => {
  const subSegments = subscription.split('/');
  const topicSegments = topic.split('/');

  for (let i = 0; i < subSegments.length; i += 1) {
    const sub = subSegments[i];
    const segment = topicSegments[i];

    if (sub === '#') {
      return true;
    }

    if (segment === undefined) {
      return false;
    }

    if (sub === '+') {
      continue;
    }

    if (sub !== segment) {
      return false;
    }
  }

  return subSegments.length === topicSegments.length;
};
