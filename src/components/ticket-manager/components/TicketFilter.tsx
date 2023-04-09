import React, {useState} from "react";
import Filter from "@geist-ui/icons/filter";
import {Button} from "@geist-ui/core";
import styled from "styled-components";

const FilterOptionRow = styled(Button)`
  
`

function TicketFilter() {
  const filterOptions = ['Todo', 'In Progress', 'Waiting on Customer', 'Waiting on Engineering', 'Closed']
  const [filterState, setFilterState] = useState(false)

  return (
    <>
      <Button style={{border: "none"}} onClick={() => setFilterState(!filterState)} auto iconRight={<Filter/>} />
      {filterState && <div style={{display: "grid", position: "absolute", top: "3rem", left: "21rem", border: "1px solid", backgroundColor: "#1f2130", borderRadius: "0.25rem"}}>
        {filterState &&
          filterOptions.map((filterOption) => {
           return (
             <FilterOptionRow key={filterOption}>{filterOption}</FilterOptionRow>
          )})
        }
      </div>}
    </>
  )
}

export default TicketFilter