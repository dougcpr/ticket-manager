import React, {useEffect, useState} from "react";
import {Pause, Circle, Save, List} from '@geist-ui/icons'
import useMousePosition from "@/components/simpledoc/useMousePosition";
import {supabase} from "@/lib/supabaseClient";
import {Button, Spacer, Input, AutoComplete} from "@geist-ui/core";
import {PostgrestResponse} from "@supabase/supabase-js";
import styled from "styled-components";

const SimpleDocContainer = styled.div`
  position: absolute;
  top: 0;
  right: 1rem;
  z-index: 2;
  display: flex;
`

const WorkflowList = styled.div``

function SimpleDoc() {
  const [workflows, setWorkflows] = useState<any>();
  const [workflowName, setWorkflowName] = useState<any>('');
  const [workflowOptions, setWorkflowOptions] = useState<any[]>([])
  const [workflowListVisibility, setWorkflowListVisibility] = useState<any>(false);
  let savedItems = 1;
  let newCursor = document.createElement("div")
  let mouseEvent = 1
  const mouseInfo = useMousePosition()

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = () => {
    supabase
      .from('Workflows')
      .select('*')
      .then(({data}: PostgrestResponse<any>) => {
        setWorkflows(data)
        createWorkflowOptions(data)
      })
  }

  const createWorkflowOptions = (data: any) => {
    let options: any[] = []
    data.map((workflow: any, index: number) => {
      options.push({label: workflow.name, value: index})
    })
    setWorkflowOptions(options)
  }

  const createNewCursor = () => {
    newCursor.style.display = "block"
    newCursor.style.height = "1rem"
    newCursor.style.width = "1rem"
    newCursor.style.border = "1px solid white"
    newCursor.style.position = "absolute"
    newCursor.style.borderRadius = "25%"
    newCursor.style.left = `${mouseInfo.mousePosition.x}px`
    newCursor.style.top = `${mouseInfo.mousePosition.y}px`
    document.body.style.cursor = "none"
    document.body.appendChild(newCursor)
  }


  let startMousePlayback = (workflow: any) => {
    document.body.style.border = "1px solid green"
    if (workflow.playback.length !== mouseEvent) {
      setTimeout(() => {
        newCursor.style.transition = '0.6s'
        newCursor.style.left = `${workflow.playback[mouseEvent].x}px`
        newCursor.style.top = `${workflow.playback[mouseEvent] .y}px`
        // @ts-ignore
        document.elementFromPoint(
          // @ts-ignore
          workflow.playback[mouseEvent].x,
          // @ts-ignore
          workflow.playback[mouseEvent] .y).click();
        mouseEvent++
        startMousePlayback(workflow)
      }, 1000)
    } else {
      newCursor.style.display = "none"
      document.body.style.border = "1px solid transparent"
      document.body.style.cursor = "default"
    }
  }

  return (
    <SimpleDocContainer>
      <div>
        {localStorage.getItem("recording") !== 'false' ?
          <Button type="secondary" auto iconRight={<Pause />} onClick={() => {
            localStorage.setItem("recording", "false")
            document.body.style.border = "1px solid transparent"
          }}/> :
          <Button type="secondary" auto iconRight={<Circle />} onClick={() => {
            localStorage.setItem("recording", "true")
            document.body.style.border = "1px solid red"
          }}/>}
      </div>
      <Spacer w={1}/>
      <div>
        {(
            mouseInfo.mouseClickLocations.length > 0 &&
            localStorage.getItem("recording") !== 'true') &&
            <div>
                <Button
                    type="secondary"
                    auto
                    iconRight={<Save />}
                    onClick={async () => {
                      const { data, error } = await supabase
                        .from('Workflows')
                        .insert([
                          { name: workflowName, playback: mouseInfo.mouseClickLocations },
                        ])
                      setWorkflowName('')
                    }}

                />
                <Input
                    value={workflowName}
                    onChange={(e) => {setWorkflowName(e.target.value)}}
                    placeholder="Enter workflow name..." />
            </div>

        }
      </div>
      <Spacer w={1}/>
      <div>
        {workflows &&
            <Button
                type="secondary"
                auto
                onClick={() => {setWorkflowListVisibility(!workflowListVisibility)}}
                iconRight={<List />}
            />
        }
      </div>
      <Spacer w={1}/>
      {workflowListVisibility &&
        <WorkflowList>
            <AutoComplete
                options={workflowOptions}
                placeholder="Select workflow"
                onSelect={(value) => {
                  createNewCursor()
                  startMousePlayback(workflows[Number(value)])
                }}
            />
        </WorkflowList>
      }
      {/*{<WorkflowList>*/}
      {/*  {workflowListVisibility && workflows.map((workflow: any) => {*/}
      {/*    return (*/}
      {/*      <>*/}
      {/*        <Button*/}
      {/*          type="secondary"*/}
      {/*          width="100%"*/}
      {/*          key={workflow.id}*/}
      {/*          onClick={() => {*/}
      {/*            newCursor.style.display = "block"*/}
      {/*            newCursor.style.height = "1rem"*/}
      {/*            newCursor.style.width = "1rem"*/}
      {/*            newCursor.style.border = "1px solid white"*/}
      {/*            newCursor.style.position = "absolute"*/}
      {/*            newCursor.style.borderRadius = "25%"*/}
      {/*            newCursor.style.left = `${mouseInfo.mousePosition.x}px`*/}
      {/*            newCursor.style.top = `${mouseInfo.mousePosition.y}px`*/}
      {/*            document.body.style.cursor = "none"*/}
      {/*            document.body.appendChild(newCursor)*/}
      {/*            startMousePlayback(workflow)}*/}
      {/*          }>{workflow.name}</Button>*/}
      {/*        <Spacer h={1}/>*/}
      {/*      </>*/}
      {/*    )*/}
      {/*  })}*/}
      {/*</WorkflowList>}*/}
    </SimpleDocContainer>
  )
}

export default SimpleDoc