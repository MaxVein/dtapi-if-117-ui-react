import React from "react";
import { useLocation } from "react-router-dom";
export default function Tests() {
  let { id } = useLocation();
  return <div>{id}hi</div>;
}
