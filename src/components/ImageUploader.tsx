import React, { useState, useRef } from "react";
// import { formDataType } from "../pages/CreateUpdatePost";
import ImageUploading, { ImageListType } from "react-images-uploading";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "../utils/canvasPreview";
import { useDebounceEffect } from "../utils/useDebounceEffect";
import "react-image-crop/dist/ReactCrop.css";
import clsx from "clsx";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

type AppProps = {
  message?: string;
  operation?: string;
  url?: string;
  // formData: formDataType;
  // setFormData: (formData: formDataType) => void;
};

const App: React.FC<AppProps> = ({
  message = "Click or Drop here",
  operation = "create",
  url = "",
  // formData,
  // setFormData,
}) => {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [fileName, setFileName] = useState("");
  const [images, setImages] = useState<ImageListType>([]);
  const [imageContainer, setImageContainer] = useState("block");
  const [cropSectionVisibility, setCropSectionVisibility] = useState("block");
  const [selectedCropSection, setSelectedCropSection] = useState("none");
  const [selectedCroppedImageSrc, setSelectedCroppedImageSrc] = useState("");
  const aspect = 16 / 9;

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    setImgSrc(imageList[0]["data_url"]);
    if (imageList[0].file) {
      setFileName(imageList[0].file.name);
    }
    setCrop(undefined); // Makes crop preview update between images.
    setImageContainer("none"); // hides fake image container

    if (cropSectionVisibility === "none") setCropSectionVisibility("block");
  };

  // MARK: onImageLoad
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
    setImageContainer("none"); // hides fake image container
  }

  // MARK: onDownloadCropClick
  async function onCropSelected() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    const file = new File([blob], `${fileName} cropped`, {
      type: "image/jpeg",
    });

    setCropSectionVisibility("none");
    // setFormData({ ...formData, file: file });
    const croppedImgUrl = URL.createObjectURL(file);
    setSelectedCroppedImageSrc(croppedImgUrl);
    setSelectedCropSection("block");
    console.log(file);
  }

  function onRemoveCrop() {
    setImageContainer("block");
    setSelectedCropSection("none");
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop],
  );

  // MARK: render
  return (
    <div>
      <ImageUploading value={images} onChange={onChange} dataURLKey="data_url">
        {({ imageList, onImageUpload, isDragging, dragProps }) => (
          <div>
            <BlogImgUploadBtn
              imageContainer={imageContainer}
              operation={operation}
              isDragging={isDragging}
              message={message}
              url={url}
              dragProps={{ ...dragProps }}
              onImageUpload={onImageUpload}
            />
            <ImgCrop
              cropSectionVisibility={cropSectionVisibility}
              aspect={aspect}
              imgSrc={imgSrc}
              imgRef={imgRef}
              previewCanvasRef={previewCanvasRef}
              completedCrop={completedCrop}
              crop={crop}
              setCrop={setCrop}
              setCompletedCrop={setCompletedCrop}
              onCropSelected={onCropSelected}
              onImageLoad={onImageLoad}
            />
            <BlogImgRemovalBtn
              selectedCropSection={selectedCropSection}
              selectedCroppedImageSrc={selectedCroppedImageSrc}
              onRemoveCrop={onRemoveCrop}
            />
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default App;

interface ImgUploadBtnProps {
  imageContainer: string;
  operation: string;
  isDragging: boolean;
  message: string;
  url: string;
  dragProps: {
    onDrop: (e: React.DragEvent<HTMLElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLElement>) => void;
    onDragStart: (e: React.DragEvent<HTMLElement>) => void;
  };
  onImageUpload: () => void;
}

const BlogImgUploadBtn: React.FC<ImgUploadBtnProps> = ({
  imageContainer,
  operation,
  isDragging,
  message,
  url,
  dragProps,
  onImageUpload,
}) => {
  return (
    <div className="mx-auto w-full text-start md:mb-0 xl:text-xl">
      {operation === "create" ? (
        <button
          style={{ display: `${imageContainer}` }}
          className={
            isDragging
              ? "w-full cursor-pointer rounded border-none bg-white px-[1em] py-[0.5em] text-sm font-semibold text-slate-600 ring-1 ring-slate-400 hover:bg-blue-100 max-md:mt-5 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              : "w-full cursor-pointer rounded border-none bg-white px-[1em] py-[0.5em] text-sm font-semibold text-slate-600 ring-1 ring-slate-400 hover:bg-slate-100 max-md:mt-5 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          }
          onClick={(e) => {
            e.preventDefault();
            onImageUpload();
          }}
          {...dragProps}
        >
          {message}
        </button>
      ) : (
        <div style={{ display: `${imageContainer}` }}>
          <div className="relative bottom-0 left-0 h-[24rem] w-full max-sm:h-[12rem]">
            <img
              className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
              src={url}
              alt=""
            />
          </div>
          <button
            className="mt-2 rounded bg-blue-500 px-[1em] py-[0.5em] font-bold text-white hover:bg-blue-700 max-sm:text-sm"
            onClick={(e) => {
              e.preventDefault();
              onImageUpload();
            }}
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

interface ImgCropPros {
  cropSectionVisibility: string;
  aspect: number;
  imgSrc: string;
  imgRef: React.RefObject<HTMLImageElement>;
  previewCanvasRef: React.RefObject<HTMLCanvasElement>;
  completedCrop: PixelCrop | undefined;
  crop: Crop | undefined;
  setCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>;
  setCompletedCrop: React.Dispatch<React.SetStateAction<PixelCrop | undefined>>;
  onCropSelected: () => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const ImgCrop: React.FC<ImgCropPros> = ({
  cropSectionVisibility,
  aspect,
  imgSrc,
  imgRef,
  previewCanvasRef,
  completedCrop,
  crop,
  setCrop,
  setCompletedCrop,
  onCropSelected,
  onImageLoad,
}) => {
  return (
    <div
      // style={{ display: `${cropSectionVisibility}` }}
      className="absolute left-0 top-0 h-[120vh] w-full bg-[rgba(0,0,0,0.7)]"
    >
      <div
        style={{
          display: `${cropSectionVisibility}`,
        }}
        className="w-1/2 bg-white p-5"
      >
        <div
          style={{ display: `${cropSectionVisibility}` }}
          className="relative bottom-0 left-0 w-full"
        >
          <div>
            {!!imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                // minWidth={400}
                minHeight={100}
                // circularCrop
              >
                <img
                  className="rounded-lg object-cover"
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </div>
          {!!completedCrop && (
            <div>
              {/* remove the hidden class to see crop preview. 
        This element can't be removed or the library will
        misbehave.*/}
              <div className="hidden">
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    border: "1px solid black",
                    objectFit: "contain",
                    width: "100%",
                    // width: completedCrop.width,
                    // height: completedCrop.height,
                  }}
                />
              </div>
              <button
                className="mt-2 rounded bg-green-600 px-[1em] py-[0.5em] font-bold text-white hover:bg-green-700 max-sm:text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onCropSelected();
                }}
              >
                Crop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ImgRemovalBtnProps {
  selectedCropSection: string;
  selectedCroppedImageSrc: string;
  onRemoveCrop: () => void;
}

const BlogImgRemovalBtn: React.FC<ImgRemovalBtnProps> = ({
  selectedCropSection,
  selectedCroppedImageSrc,
  onRemoveCrop,
}) => {
  return (
    <div style={{ display: `${selectedCropSection}` }}>
      <div className="relative bottom-0 left-0 h-[24rem] w-full max-sm:h-[12rem]">
        <img
          className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
          src={selectedCroppedImageSrc}
          alt=""
        />
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          onRemoveCrop();
        }}
        className="mt-2 rounded bg-red-500 px-[1em] py-[0.5em] font-bold text-white hover:bg-red-700 max-sm:text-sm"
      >
        Remove
      </button>
    </div>
  );
};
