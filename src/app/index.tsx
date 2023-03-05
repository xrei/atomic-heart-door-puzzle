import {DoorLock} from '@app/puzzle'

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-700">
      <div className="flex flex-col items-center justify-center flex-1">
        <DoorLock />
      </div>
    </div>
  )
}
