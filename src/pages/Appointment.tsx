import React, { useState, useRef, useEffect } from 'react'
import { useParams, useLocation, useHistory, Redirect } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import Meet from '../components/Meet'
import { IOptions } from '../types'

type ProfileType = 'doctor' | 'patient'

const PreAppointment: React.FC = () => {
  const BASE_IFRAME_SRC = 'http://localhost:3000/meet'
  const containerRef = useRef<HTMLDivElement>(null)
  const location = useLocation<{
    state: IOptions
  }>()
  const history = useHistory()
  const { profile, roomName } =
    useParams<{ profile: ProfileType; roomName: string }>()

  const [renderMeet, setRenderMeet] = useState(false)
  const [strIframe, setStrIframe] = useState('')

  const endAppointment = () => {
    const iframeMeet = document.getElementById(
      'iframe-meet'
    ) as HTMLIFrameElement
    if (iframeMeet) {
      console.log('PostMessage immailStopRecording')

      iframeMeet.contentWindow?.postMessage(
        'stopRecording',
        'http://localhost:3000'
      )
      iframeMeet.contentWindow?.postMessage(
        { type: 'hangup' },
        'http://localhost:3000'
      )
      setTimeout(() => {
        iframeMeet.contentWindow?.postMessage(
          { type: 'dispose' },
          'http://localhost:3000'
        )

        if (profile === 'doctor') history.replace('/')
      }, 1500)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const isModerator = profile === 'doctor'
      const getRoomTokenUrl = `${
        import.meta.env.VITE_API_URL
      }/api/meet/token/participant?roomName=${roomName}&moderator=${isModerator}`
      try {
        const response = await fetch(getRoomTokenUrl)
        const { token: roomToken } = await response.json()
        const {
          firstName: first_name,
          lastName: last_name,
          startRecording: start_recording,
          avatar,
          startWithAudioMuted,
          startWithVideoMuted,
          fileRecordingsEnabled,
          liveStreamingEnabled,
          hideLogo,
          hideButtons,
          hideDesktopLink,
        } = location.state as IOptions

        const query: any = {
          jwt: roomToken,
          first_name,
          last_name,
          avatar,
          start_recording,
          startWithAudioMuted,
          startWithVideoMuted,
          fileRecordingsEnabled,
          liveStreamingEnabled,
          hideLogo,
          hideButtons,
          hideDesktopLink,
        }

        const queryString = Object.keys(query).reduce((acc, key, i) => {
          if (i > 0) acc += '&'

          acc += `${key}=${query[key]}`
          return acc
        }, '')
        const src = `${BASE_IFRAME_SRC}/${roomName}?${queryString}`
        console.log(`????IFRAME src`, src)
        setStrIframe(`
          <iframe
            id="iframe-meet"
            allow="camera;microphone;display-capture"
            allowFullscreen="true"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            width="100%"
            height="100%"
            src="${src}"
          ></iframe>
        `)
        setRenderMeet(true)
      } catch (error) {
        console.log('ERROR:', error)
      }
    }
    fetchData()
  }, [])

  if (!location.state) {
    return (
      <>
        <Redirect
          to={{ pathname: `/${profile}/pre-appointment/${roomName}` }}
        />
      </>
    )
  }

  return (
    <div className="flex flex-1">
      <div className="bg-white p-3 rounded-md flex flex-col flex-1">
        <Header
          title={profile === 'doctor' ? 'Welcome Doctor' : 'Welcome Patient'}
          subtitle=""
        />
        <div className="flex h-full gap-4">
          <div ref={containerRef} className="flex flex-1">
            {!renderMeet && (
              <div className="flex flex-1">Creating a room session...</div>
            )}
            {renderMeet && (
              <Meet
                iframe={strIframe}
                className="flex flex-1 h-full rounded-md"
              />
            )}
          </div>
          {profile === 'doctor' && (
            <div className="flex flex-col gap-2 justify-self-end">
              <div className="w-auto rounded-md flex flex-col">
                <label className="font-bold" htmlFor="notes">
                  Write down some notes about the patient
                </label>
                <textarea
                  className="p-2 bg-yellow-50 rounded-md border resize-none"
                  name="notes"
                  id="notes"
                  rows={20}
                  cols={30}
                  wrap="soft"
                ></textarea>
              </div>
              <div className="flex gap-4">
                <Button negative onClick={endAppointment}>
                  End Appointment
                </Button>
                <Button>Save Notes</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PreAppointment
