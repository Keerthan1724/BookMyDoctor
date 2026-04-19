import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getImageUrl } from "../utils/media";
import { getInitialFromName } from "../utils/avatar";

const Avatar = ({
  name,
  image,
  alt,
  className = "",
  imageClassName = "",
  textClassName = "",
  disableFallbackBackground = false,
}) => {
  const { getAvatarColors } = useContext(AuthContext);
  const avatarStyle = getAvatarColors(name);
  const imageUrl = getImageUrl(image);
  const initial = getInitialFromName(name);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{
        backgroundColor:
          imageUrl || disableFallbackBackground ? undefined : avatarStyle.bg,
        color: imageUrl || disableFallbackBackground ? undefined : avatarStyle.color,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt || name || "avatar"}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <span className={textClassName}>{initial}</span>
      )}
    </div>
  );
};

export default Avatar;
