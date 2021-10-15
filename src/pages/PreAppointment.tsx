import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'
import { IOptions } from '../types'
type ProfileType = 'doctor' | 'patient'

const INITIAL_OPTIONS_VALUE: IOptions = {
  firstName: '',
  lastName: '',
  startWithAudioMuted: false,
  startWithVideoMuted: false,
  fileRecordingsEnabled: false,
  startRecording: false,
  liveStreamingEnabled: false,
  hiddenLogo: true,
}

const PreAppointment: React.FC = () => {
  const history = useHistory()
  const [options, setOptions] = useState<IOptions>(INITIAL_OPTIONS_VALUE)
  const { profile, roomName } =
    useParams<{ profile: ProfileType; roomName: string }>()

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget
    const value = ['firstName', 'lastName'].includes(target.name)
      ? target.value
      : target.checked

    setOptions({
      ...options,
      [target.name]: value,
    })
  }

  const goToAppointment = () => {
    const profileRoute = profile === 'doctor' ? 'doctor' : 'patient'
    history.push(`/${profileRoute}/appointment/${roomName}`, options)
  }

  return (
    <div>
      <div className="bg-white p-3 rounded-md max-w-3xl">
        <Header
          title={profile === 'doctor' ? 'Welcome Doctor' : 'Welcome Patient'}
          subtitle="Please, type your data and choose your preferences."
        />

        <div className="flex flex-col mt-8 gap-4">
          <div className="flex justify-start gap-3">
            <input
              className="border border-gray-400 rounded-md block w-52 px-2 py-1
              focus:ring-blue-500 focus:border-blue-500
              text-base"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={options.firstName}
              onChange={handleInputChange}
            />
            <input
              className="border border-gray-400 rounded-md block w-52 px-2 py-1
              focus:ring-blue-500 focus:border-blue-500
              text-base"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={options.lastName}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-2 grid-rows-2 max-w-lg">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="startWithAudioMuted"
                  checked={options.startWithAudioMuted}
                  onChange={handleInputChange}
                />
                <span>Start with audio muted</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="startWithVideoMuted"
                  checked={options.startWithVideoMuted}
                  onChange={handleInputChange}
                />
                <span>Start with video muted</span>
              </div>
              {profile === 'doctor' && (
                <>
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      name="fileRecordingsEnabled"
                      checked={options.fileRecordingsEnabled}
                      onChange={handleInputChange}
                    />
                    <span>Allow file recording</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      disabled={!options.fileRecordingsEnabled}
                      type="checkbox"
                      name="startRecording"
                      checked={options.startRecording}
                      onChange={handleInputChange}
                    />
                    <span>Start recording automatically</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex w-full items-center gap-6">
            <div className="w-full max-w-xs">
              <Button type="button" onClick={goToAppointment}>
                Join the appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreAppointment
