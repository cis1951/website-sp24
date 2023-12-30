export type StaffMemberProps = {
    name: string
    section?: "501" | "502"
    flavorText?: string
    pennkey: string
    school: "sas" | "seas" | "wharton" // Sorry, forgot what Penn Medicine has
    pronouns: string
    github?: string
    website?: string
    avatar?: string
}

function StaffMember({
    name,
    flavorText,
    section,
    pennkey,
    school,
    pronouns,
    github,
    website,
    avatar,
}: StaffMemberProps) {
    const links = [
        github && {
            text: "GitHub",
            href: `https://github.com/${github}`,
        },
        website && {
            text: "Website",
            href: website,
        }
    ].filter(link => link)

    return <div className="flex gap-3 items-center">
        <div className="bg-neutral-200 dark:bg-neutral-600 aspect-square w-28 rounded-full overflow-hidden shrink-0">
            {avatar && <img className="block w-full h-full object-cover" src={avatar} />}
        </div>
        <div>
            <h4 className="font-bold m-0 leading-tight">
                {name}
                {section && <span className="font-medium opacity-70"> ({section})</span>}
            </h4>
            {flavorText && <div className="italic opacity-60 text-sm">{flavorText}</div>}
            <div className="text-sm mt-2"><span className="font-medium">Email</span>: <span className="font-mono">{pennkey}@{school}</span></div>
            <div className="text-sm"><span className="font-medium">Pronouns</span>: {pronouns}</div>
            {links.length > 0 && <div className="text-sm flex gap-2">
                {links.map(({ text, href }, index) => <a key={index} href={href} className="link" target="_blank" rel="noopener noreferrer">{text}</a>)}
            </div>}
        </div>
    </div>
}

export type StaffGridProps = {
    members: StaffMemberProps[]
}

export function StaffGrid({ members }: StaffGridProps) {
    return <div className="grid lg:grid-cols-2 xl:grid-cols-3 my-4 gap-4">
        {members.map((member, index) => <StaffMember key={index} {...member} />)}
    </div>
}