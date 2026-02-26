import os
from PIL import Image

def convert_to_webp(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                try:
                    img = Image.open(file_path)
                    webp_path = os.path.splitext(file_path)[0] + '.webp'
                    img.save(webp_path, 'WEBP', quality=85)
                    print(f"Convertido: {file_path} -> {webp_path}")
                    # Opcional: remover o original se desejar economizar espaço no repo
                    # os.remove(file_path)
                except Exception as e:
                    print(f"Erro ao converter {file_path}: {e}")

if __name__ == "__main__":
    convert_to_webp('/home/ubuntu/gatinhas-club/public')
