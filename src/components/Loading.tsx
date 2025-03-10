import { ColorRing } from "react-loader-spinner";
export default function Loading() {
  return (
    <div className="flex justify-center">
      <ColorRing
        visible={true}
        height="60"
        width="60"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={["purple", "purple", "purple", "purple", "purple"]}
      />
    </div>
  );
}