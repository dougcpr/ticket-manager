import React  from 'react';
import styled from 'styled-components'

const CustomTextArea = styled.textarea`
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
`

export const TextArea = (props: any) => {
  const {...RemainingProps} = props;
  return (
    <CustomTextArea {...RemainingProps} value={props.children}/>
  )
}