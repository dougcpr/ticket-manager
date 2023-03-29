import React  from 'react';
import styled from 'styled-components'

const Card = styled.div`
    border-radius: 0.1875rem;
    background-color: white;
    box-sizing: border-box;
    border: 1px solid #e0e0e0;
    color: black;
    margin: 0;
    min-width: 6.25rem;
    padding: 0.75rem 1rem 0.75rem 0.875rem;
    overflow: hidden;
    width: 100%;
    justify-content: space-around;
    @media (max-width : 812px) {
        border-radius: 0;
    }
`

// eslint-disable-next-line react/display-name
export default (props: any) => {
  const {
    ...RemainingProps} = props;
  return (
    <Card
      {...RemainingProps}>
      {props.children}
    </Card>
  )
}