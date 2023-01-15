const timePassed = (createdAt: string): string => {
  const now = new Date().getTime() / 1000;
  const secondsPassed = Math.floor(now - +createdAt / 1000);
  if (secondsPassed <= 1) return "1 second ago";
  if (secondsPassed < 60) return `${secondsPassed} seconds ago`;
  const minutesPassed = Math.floor(secondsPassed / 60);
  if (minutesPassed <= 1) return "1 minute ago";
  if (minutesPassed < 60) return `${minutesPassed} minutes ago`;
  const hoursPassed = Math.floor(secondsPassed / 3600);
  if (hoursPassed <= 1) return "1 hour ago";
  if (hoursPassed < 24) return `${hoursPassed} hours ago`;
  const daysPassed = Math.floor(secondsPassed / 86400);
  if (daysPassed <= 1) return "1 day ago";
  if (daysPassed < 7) return `${daysPassed} days ago`;
  const weeksPassed = Math.floor(secondsPassed / 604800);
  if (weeksPassed <= 1) return "1 week ago";
  if (weeksPassed < 4) return `${weeksPassed} weeks ago`;
  const monthsPassed = Math.floor(secondsPassed / 2629746);
  if (monthsPassed <= 1) return "1 month ago";
  if (monthsPassed < 12) return `${monthsPassed} months ago`;
  const yearsPassed = Math.floor(secondsPassed / 31556952);
  if (yearsPassed <= 1) return "1 year ago";
  return `${yearsPassed} years ago`;
};

export default timePassed;
