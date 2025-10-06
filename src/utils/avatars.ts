export const AVATAR_OPTIONS = [
  { id: 'default', label: 'Default', color: '#3B82F6' },
  { id: 'red', label: 'Red', color: '#EF4444' },
  { id: 'blue', label: 'Blue', color: '#3B82F6' },
  { id: 'green', label: 'Green', color: '#10B981' },
  { id: 'yellow', label: 'Yellow', color: '#F59E0B' },
  { id: 'purple', label: 'Purple', color: '#8B5CF6' },
  { id: 'pink', label: 'Pink', color: '#EC4899' },
  { id: 'indigo', label: 'Indigo', color: '#6366F1' },
  { id: 'teal', label: 'Teal', color: '#14B8A6' },
  { id: 'orange', label: 'Orange', color: '#F97316' },
] as const;

export type AvatarId = typeof AVATAR_OPTIONS[number]['id'];

export const getAvatarColor = (avatarId: string): string => {
  const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId);
  return avatar?.color || AVATAR_OPTIONS[0].color;
};

export const getAvatarInitials = (username: string): string => {
  if (!username) return '?';

  const parts = username.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return username.slice(0, 2).toUpperCase();
};
