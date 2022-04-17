const SubmitForm = () => {

    function clickedMe(){
        alert("You clicked me");
    }

    return (
        <div className="h-screen font-ibm-plex-sans">
            <div className="flex items-center justify-center content-center min-h-screen min-">
                <div>
                    
                </div>
                    <button className="bg-green-400 text-white py-1 px-4 w-1/4 rounded-sm font-ibm-plex-sans" onClick={clickedMe}>Driving</button>
                    <button className="bg-green-400 text-white py-1 px-4 w-1/4 rounded-sm font-ibm-plex-sans" onClick={clickedMe}>Riding</button>
            </div>
            
        </div>
    );
}

export default SubmitForm;
