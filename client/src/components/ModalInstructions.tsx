import React, { useEffect, useRef } from "react";

type Props = {
  setShowModal: (showModal: boolean) => void;
};

const ModalInstructions = ({ setShowModal }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && ref.current === e.target) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div
      ref={ref}
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm z-10"
    >
      <div className="flex flex-col bg-white shadow-md rounded w-1/2 h-4/5 overflow-x-scroll">
        <div className="flex justify-end pt-5 pr-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="block text-center font-bold text-3xl">Instruction</p>
        <div className="pt-5 px-16 mx-auto">
          <p className="mt-5">
            <span className="font-bold">Markdown</span> is a simple way to
            format text that looks great on any device. All you have to do is
            use the methods shown in the table below and your text will be
            formatted in the presented way.
          </p>
          <table className="table-fixed w-full mt-10 text-center mb-10">
            <thead className="text-sm uppercase bg-gray-50">
              <tr>
                <th className="py-3">Type</th>
                <th className="py-3">Or</th>
                <th className="py-3">To get</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">*Italic*</td>
                <td className="py-3">_Italic_</td>
                <td className="py-3 prose">
                  <i>Italic</i>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3">**Bold**</td>
                <td className="py-3">__Bold__</td>
                <td className="py-3 prose">
                  <b>Bold</b>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3"># Heading 1</td>
                <td className="py-3">
                  Heading 1 <br />
                  =========
                </td>
                <td className="py-3 prose">
                  <h1>Heading 1</h1>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3">## Heading 2</td>
                <td className="py-3">
                  Heading 2 <br />
                  ---------
                </td>
                <td className="py-3 prose">
                  <h2>Heading 2</h2>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3">[Link](http://a.com)</td>
                <td className="py-3">
                  [Link][1]
                  <br />
                  <br />
                  [1]: http://b.org
                </td>
                <td className="py-3 prose">
                  <a>Link</a>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3">{"> "}Blockquote</td>
                <td className="py-3"></td>
                <td className="py-3 prose">
                  <blockquote>Blockquote</blockquote>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3">
                  * List <br />
                  * List <br />* List
                </td>
                <td className="py-3">
                  - List <br />
                  - List <br />- List
                </td>
                <td className="py-3 prose">
                  <ul>
                    <li>List</li>
                    <li>List</li>
                    <li>List</li>
                  </ul>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3">
                  1. One <br />
                  2. Two <br />
                  3. Three
                </td>
                <td className="py-3">
                  1) One <br />
                  2) Two <br />
                  3) Three
                </td>
                <td className="py-3 prose">
                  <ol>
                    <li>One</li>
                    <li>Two</li>
                    <li>Three</li>
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModalInstructions;
