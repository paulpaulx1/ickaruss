export const compressImage = async (file: File): Promise<Blob> => {
    const image = await createImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxWidth = 800; // Set the maximum width to something like 800px
    const maxHeight = 800; // Set the maximum height to 800px
    let width = image.width;
    let height = image.height;

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;

    ctx?.drawImage(image, 0, 0, width, height);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      }, 'image/jpeg', 0.7); // Adjust the quality as needed
    });
  };

  const createImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
