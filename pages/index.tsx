import type { NextPage } from "next";
import React, { useCallback, useState } from "react";
import classNames from "classnames";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toBase64 } from "../helpers/toBase64";
import { FileListDND } from "../components/fileList";
import { useRouter } from "next/dist/client/router";

const ImageDropzone: NextPage = () => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const downloadFile = () => {
    const a = document.createElement("a");
    a.setAttribute("href", `${process.env.NEXT_PUBLIC_BASE_URL}/${fileName}`);
    a.setAttribute("download", "");
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    a.click();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const base64Files = await Promise.all(files.map(toBase64));
      const { data } = await axios.post("/api/generate-pdf", {
        base64Files,
        fullName: "Hrachya Hovakimyan",
        title: "Homework 1",
      });
      setFileName(data.name);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(
    async <T extends File>(acceptedFiles: T[]) => {
      setFiles((f) => [...f, ...acceptedFiles]);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div
        {...getRootProps()}
        className={classNames(
          "md:w-3/5 mx-2 mb-5 md:h-80 h-40 md:mt-20 mt-2 md:mx-auto px-3 flex items-center justify-center rounded-xl bg-gray-50 ring-4 ring-inset ring-gray-200 border-dashed border-2 border-gray-700 shadow-2xl",
          {
            " bg-indigo-400 text-gray-50": isDragActive,
          }
        )}
      >
        <input {...getInputProps({ accept: "image/*" })} />
        {isDragActive ? (
          <span className=" text-9xl">+</span>
        ) : (
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )}
      </div>
      <FileListDND setFiles={setFiles} files={files} />
      <div className="text-center mt-4 space-x-4">
        {!fileName ? (
          <button
            disabled={loading}
            onClick={() => handleSave()}
            className={classNames(
              "px-4 py-2 bg-indigo-600 focus:ring-4 ring-indigo-300 text-gray-50 rounded-lg",
              {
                "bg-opacity-40": loading,
              }
            )}
          >
            Save
          </button>
        ) : (
          <>
            <button
              disabled={!fileName}
              onClick={() => router.push(fileName)}
              className={classNames(
                "px-4 py-2 bg-indigo-600 focus:ring-4 ring-indigo-300 text-gray-50 rounded-lg",
                {
                  "bg-opacity-40": !fileName,
                }
              )}
            >
              View File
            </button>
            <button
              disabled={!fileName}
              onClick={() => downloadFile()}
              className={classNames(
                "px-4 py-2 bg-indigo-600 focus:ring-4 ring-indigo-300 text-gray-50 rounded-lg",
                {
                  "bg-opacity-40": !fileName,
                }
              )}
            >
              Download file
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ImageDropzone;
