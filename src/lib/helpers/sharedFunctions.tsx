import React from "react";

export const renderDate = (value: string | undefined) => {
  if (value) {
    const newDate = new Date(value).toLocaleDateString("en-US")
    return newDate
  } else return null
}