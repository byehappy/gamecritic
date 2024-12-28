import { Button } from "antd";
import { ChangeEvent, useRef, useState } from "react";
import AvatarEditor, { type Position } from "react-avatar-editor";
import Dropzone from "react-dropzone";
import styled from "styled-components";
import { device } from "../../styles/size";
type State = {
  image: string | File;
  position: Position;
  scale: number;
  rotate: number;
  borderRadius: number;
  width: number;
  height: number;
};
const AvatarWrapper = styled.div`
  display: flex;
  gap: 1vw;
  max-height:200px;
  @media (max-width: 425px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 5%;
    div {
      max-width: 200px;
    }
    input {
      width: 100%;
    }
  }
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

const IconEditor: React.FC<{
  editor: React.RefObject<AvatarEditor>;
  init_image: string;
}> = ({ editor, init_image }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({
    image: init_image,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 100,
    width: 200,
    height: 200,
  });

  const handleNewImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setState({ ...state, image: e.target.files[0] });
    }
  };

  const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    setState({ ...state, scale });
  };
  const rotateScale = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState({ ...state, rotate: parseFloat(e.target.value) });
  };

  const handlePositionChange = (position: Position) => {
    setState({ ...state, position });
  };
  const onImageChange = (event: any) => {
    if (event.target.files[0]) {
      const image = URL.createObjectURL(event.target.files[0]);
      setState({ ...state, image });
    }
  };

  return (
    <AvatarWrapper>
      <Dropzone
        onDrop={([image]) => setState({ ...state, image })}
        noClick
        multiple={false}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <AvatarEditor
              ref={editor}
              scale={state.scale}
              width={state.width}
              height={state.height}
              position={state.position}
              onPositionChange={handlePositionChange}
              rotate={state.rotate}
              borderRadius={state.width / (100 / state.borderRadius)}
              image={state.image}
              crossOrigin="anonymous"
              border={0}
              backgroundColor="white"
            />
            <input
              name="newImage"
              type="file"
              onChange={handleNewImage}
              {...getInputProps()}
            />
          </div>
        )}
      </Dropzone>
      <div>
        Увеличение:{" "}
        <input
          name="scale"
          type="range"
          onChange={handleScale}
          min={"0.1"}
          max="5"
          step="0.1"
          defaultValue="1"
          style={{ width: "200px" }}
        />
        <br />
        Поворот:
        <input
          name="rotation"
          type="range"
          onChange={rotateScale}
          min="0"
          max="360"
          step="1"
          defaultValue="0"
          style={{ width: "200px" }}
        />
        <br />
        <label>
          <input
            type="file"
            accept="image/png, image/jpeg, .svg"
            onChange={onImageChange}
            style={{ display: "none" }}
            ref={inputRef}
          />
          <Button onClick={() => inputRef.current?.click()}>
            Выберите файл
          </Button>
        </label>
      </div>
    </AvatarWrapper>
  );
};

export default IconEditor;
